import React, { useState } from 'react';
import MemberList from './components/MemberList';
import MemberCard from './components/MemberCard';
import FilterBar from './components/FilterBar';
import PrizeWheel from './components/PrizeWheel';
import WinnerModal from './components/WinnerModal';
import { reportError } from './utils/api';
import { extractDataFromImages } from './utils/api';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';
import GiftIcon from '@mui/icons-material/CardGiftcard';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4F5AFF',
            dark: '#6C72FF',
            contrastText: '#fff'
        },
        background: {
            paper: '#1A1F3D',
        },
    }
});

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '8px',
    padding: '12px 24px',
    margin: '15px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

function App() {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [winners, setWinners] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('score');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageBase64s, setImageBase64s] = useState([]);

     const [filters, setFilters] = useState({
        minScore: '',
        maxScore: '',
        rankFilter: ''
    });

    const handleImageChange = async (event) => {
        try {
            setError('');
            const files = Array.from(event.target.files);

            // Validate file types
            const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
            if (invalidFiles.length > 0) {
                throw new Error('Please select only image files');
            }

            // Validate file sizes (max 5MB each)
            const maxSize = 5 * 1024 * 1024; // 5MB
            const oversizedFiles = files.filter(file => file.size > maxSize);
            if (oversizedFiles.length > 0) {
                throw new Error('Some files exceed the 5MB size limit');
            }

            const readers = files.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
                    reader.readAsDataURL(file);
                });
            });

            const base64Results = await Promise.all(readers);
            setImageBase64s(base64Results);
        } catch (error) {
            reportError(error);
            setError(error.message || 'Error processing images');
        }
    };

    const extractData = async () => {
        try {
            setLoading(true);
            setError('');

            if (imageBase64s.length === 0) {
                throw new Error('Please select at least one image');
            }

            const extractedData = await extractDataFromImages(imageBase64s);

            if (extractedData.length === 0) {
                throw new Error('No valid data could be extracted from the images');
            }

            setMembers(extractedData);
              setFilteredMembers(extractedData);
        } catch (error) {
            reportError(error);
            setError(error.message || 'Failed to extract data from images');
            setMembers([]);
             setFilteredMembers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        filterMembers(term, sortOrder);
    };

    const handleSort = (event) => {
        const order = event.target.value;
        setSortOrder(order);
         filterMembers(searchTerm, order);
    };

     const filterMembers = (term, order, newFilters = filters) => {
         try {
              if (!Array.isArray(members)) {
                  throw new Error('Invalid members data');
               }
            let filtered = [...members];


             if (newFilters) {
                if (newFilters.minScore) {
                  filtered = filtered.filter(member => member.score >= parseInt(newFilters.minScore, 10));
                }
                 if (newFilters.maxScore) {
                     filtered = filtered.filter(member => member.score <= parseInt(newFilters.maxScore, 10));
                 }
                if (newFilters.rankFilter) {
                     filtered = filtered.filter(member => String(member.rank) === newFilters.rankFilter);
                 }
           }

            filtered = filtered.filter(member =>
                member.username.toLowerCase().startsWith(term.toLowerCase())
            );

            if (order === 'score') {
                filtered.sort((a, b) => b.score - a.score);
             } else if (order === 'rank') {
               filtered.sort((a, b) => a.rank - b.rank);
            }

              setFilteredMembers(filtered);
        } catch (error) {
            reportError(error);
            setError('Error filtering members');
            setFilteredMembers([]);
       }
    };

     const handleFilterChange = (newFilters) => {
      setFilters(newFilters);
      filterMembers(searchTerm, sortOrder, newFilters);
     };

    const handleChooseImageClick = () => {
        document.getElementById('image-upload').click();
    };

    return (
        <ThemeProvider theme={theme}>
            <Box data-name="app-container" sx={{minHeight: '100vh', p: 6}}>
                <Box className="card" sx={{maxWidth: '6xl', mx: 'auto'}}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                            Arcane Guild Members
                        </Typography>
                        <StyledButton
                            onClick={() => setIsSidebarOpen(true)}
                            variant="contained"
                            startIcon={<GiftIcon />}
                        >
                            Prize Wheel
                        </StyledButton>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                        <StyledButton component="span" variant="contained" onClick={handleChooseImageClick}>
                            Choose Images
                        </StyledButton>
                        <StyledButton
                            onClick={extractData}
                            disabled={loading || imageBase64s.length === 0}
                            variant="contained"
                            sx={{ opacity: loading || imageBase64s.length === 0 ? 0.5 : 1, cursor: loading || imageBase64s.length === 0 ? 'not-allowed' : 'pointer' }}
                        >
                           {loading ? 'Extracting Data...' : 'Extract Data'}
                        </StyledButton>
                    </Box>
                    <Box sx={{ mb: 6 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                id="image-upload"
                            />
                            {imageBase64s.length > 0 && (
                                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', p: 2 }}>
                                    {imageBase64s.map((base64, index) => (
                                        <img
                                            key={index}
                                            src={base64}
                                            alt={`Preview ${index + 1}`}
                                            style={{ height: '100px', width: '100px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Box>
                       <FilterBar onFilter={handleFilterChange} />
                    <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 6}}>
                       <input
                           type="text"
                           placeholder="Search members..."
                           className="search-input"
                           onChange={handleSearch}
                            value={searchTerm}
                         />
                    </Box>
                    {filteredMembers.length > 0 ? (
                           <MemberList
                                members={filteredMembers}
                                onMemberSelect={() => {}}
                            />
                         ) : (
                       filteredMembers.length === 0 && searchTerm ? (
                              <Typography sx={{ color: '#8890B5', textAlign:'center' }}>
                                     No results found for "{searchTerm}"
                                </Typography>
                         ): null
                    )}
                </Box>
                {isSidebarOpen && (
                    <Box className="fixed inset-0 bg-black/50" sx={{position: 'fixed', top:0, left:0, right:0, bottom:0}}>
                        <Box className="fixed inset-y-0 right-0 w-96 bg-[#1A1F3D] p-6 shadow-xl" sx={{position:'fixed', top: 0, bottom: 0, right:0, width: 300, backgroundColor:'#1A1F3D'}}>
                            <Box sx={{display:'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6}}>
                                <Typography variant='h6' sx={{fontWeight: 'bold', margin: '15px'}}>Prize Wheel</Typography>
                                <StyledButton
                                    onClick={() => setIsSidebarOpen(false)}
                                   sx={{color:'#8890B5', '&:hover':{color:'white'}}}
                                >
                                     <i className="fas fa-times text-xl"></i>
                               </StyledButton>
                           </Box>
                            <PrizeWheel
                                members={filteredMembers}
                                onWinnerSelect={setWinners}
                            />
                        </Box>
                    </Box>
                )}
                <WinnerModal
                    winners={winners}
                    onClose={() => setWinners([])}
                />
            </Box>
        </ThemeProvider>
    );
}
export default App;