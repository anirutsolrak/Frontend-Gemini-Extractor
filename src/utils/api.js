export async function extractDataFromImages(images) {
    try {
        const contents = images.map(img => ({
            parts: [
                {
                    text: "Extract player username, score, and rank from this Wild Rift guild member screenshot. Return the data in JSON format with the following structure: {username: string, score: number, rank: number}. Only extract these specific fields and return them in JSON format.",
                    role: "model" // Added the role
                },
                {
                    inlineData: {
                        data: img.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''),
                        mimeType: 'image/jpeg'
                    },
                    role: "user" // Added the role
                }
            ]
        }));

        const response = await fetch('/api/extrair-dados', { // Remove o endereço do backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contents })
        });

        if (!response.ok) {
            const errorData = await response.json();
             throw new Error(`HTTP error! status: ${response.status}. description: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        if (!data.dados || !Array.isArray(data.dados)) {
            throw new Error('Invalid data format received from server');
        }

        // Validate and format the received data
        return data.dados.map(item => ({
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
