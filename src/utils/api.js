import { GoogleGenerativeAI } from "@google/generative-ai";

// Certifique-se de configurar sua chave de API de forma segura, como variável de ambiente no Vercel
const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiApiKey);


export async function extractDataFromImages(images) {
    try {
         if (!geminiApiKey) {
             reportError("Chave da API Gemini não configurada no frontend.");
            throw new Error("Chave da API Gemini não configurada no frontend.");
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

         const contents = images.map(img => ({
            parts: [
                {
                    text: "Extract player username, score, and rank from this Wild Rift guild member screenshot. Return the data in JSON format with the following structure: {username: string, score: number, rank: number}. Only extract these specific fields and return them in JSON format.",
                     role: "user"
                },
                {
                    inlineData: {
                        data: img.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''),
                        mimeType: 'image/jpeg'
                    },
                   role: "user"
                }
            ]
         }));

       const base64Images = contents.map(content => {
           if(content.parts && content.parts[1] && content.parts[1].inlineData) {
            return  {
                  inlineData: {
                     data: content.parts[1].inlineData.data,
                     mimeType: content.parts[1].inlineData.mimeType,
                    }
              }
           }
          
           throw new Error('Invalid content format received from frontend');
     })

       const prompt = contents[0].parts[0].text;

       const result = await model.generateContent([prompt, ...base64Images]);

       const responseText = result.response.text();
       let extractedData = [];
     
        try {
            const jsonStringLimpo = responseText.replace('```json\n', '').replace('\n```', '');
            extractedData = JSON.parse(jsonStringLimpo);
         } catch (jsonError) {
            console.warn("Resposta da Gemini API não é JSON válido, tentando extrair dados como texto:", jsonError);
        }

         if (!Array.isArray(extractedData)) {
            throw new Error("Nenhum texto ou dados extraídos pela API Gemini.");
        }

         return extractedData.map(item => ({
                username: String(item.username || ''),
                score: parseInt(item.score || 0, 10),
                rank: parseInt(item.rank || 0, 10)
            }));
         
    } catch (error) {
        reportError(error);
        throw new Error(`Failed to process images: ${error.message}`);
    }
}

export function reportError(error) {
    console.error("An error occurred:", error);
}
