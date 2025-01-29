import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';

const StyledWinnerModal = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledModalContent = styled(Box)(({ theme }) => ({
    backgroundColor: '#1A1F3D',
    borderRadius: '16px',
    padding: theme.spacing(6),
     maxWidth: '400px',
    width: '100%',
}));

const StyledWinnerItem = styled(Box)(({ theme }) => ({
    backgroundColor: '#272B4A',
    borderRadius: '8px',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

const StyledAvatar = styled(Box)(({ theme }) => ({
    backgroundColor: '#4F5AFF',
    borderRadius: '50%',
    padding: theme.spacing(1),
}));


function WinnerModal({ winners, onClose }) {
    if (!winners.length) return null;
    return (
           <StyledWinnerModal data-name="winner-modal">
                <StyledModalContent>
                   <Box sx={{textAlign: 'center', mb: 6}}>
                         <Typography variant="h5" sx={{mb: 2}}>🎉 Congratulations! 🎉</Typography>
                    </Box>
                    {winners.map((winner, index) => (
                       <StyledWinnerItem key={index}>
                            <StyledAvatar>
                              <i className="fas fa-crown text-white"></i>
                          </StyledAvatar>
                         <Box>
                                <Typography sx={{color: '#8890B5'}}>Ganhador: {winner.username}</Typography>
                         </Box>
                    </StyledWinnerItem>
                    ))}
                    <Button
                        onClick={onClose}
                        className="w-full bg-[#4F5AFF] text-white py-3 rounded-lg mt-4 hover:bg-[#6C72FF] transition-colors"
                         sx={{width: '100%'}}
                    >
                        Close
                   </Button>
              </StyledModalContent>
        </StyledWinnerModal>
    );
}

export default WinnerModal;