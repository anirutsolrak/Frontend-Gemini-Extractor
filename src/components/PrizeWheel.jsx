import React, { useState } from 'react';
import { reportError } from '../utils/api';
import { Box, Typography, Button, TextField, styled } from '@mui/material';
import TrophyIcon from '@mui/icons-material/EmojiEvents';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(255, 255, 255)',
            borderRadius: '8px'
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
    '& label.Mui-focused': {
        color: theme.palette.primary.main,
    },
    '& .MuiInputBase-input': {
        color: 'white',
        textAlign: 'center'
    },
}));


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


function PrizeWheel({ members, onWinnerSelect }) {
    const [spinning, setSpinning] = useState(false);
    const [winnerCount, setWinnerCount] = useState('2');
     const [isNumberValid, setIsNumberValid] = useState(true);

    const handleWinnerCountChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
          setWinnerCount(value);
          setIsNumberValid(true);
        } else {
          setIsNumberValid(false);
       }
    };

    const spinWheel = () => {
        try {
            if (spinning || members.length === 0) return;
          if(!isNumberValid) {
            return;
          }
            setSpinning(true);

            setTimeout(() => {
                const winners = [];
                const tempMembers = [...members];
                
                const numberOfWinners = parseInt(winnerCount, 10);
                
                  if (isNaN(numberOfWinners) || numberOfWinners < 1 || numberOfWinners > members.length) {
                        throw new Error('Please enter a valid number of winners.');
                    }
                
                 for (let i = 0; i < numberOfWinners; i++) {
                      if (tempMembers.length === 0) break;
                    const randomIndex = Math.floor(Math.random() * tempMembers.length);
                    const selectedMember = tempMembers.splice(randomIndex, 1)[0];
                    winners.push(selectedMember);
                 }

                onWinnerSelect(winners);
                setSpinning(false);
            }, 3000);
        } catch (error) {
            reportError(error);
            setSpinning(false);
          setIsNumberValid(false);
        }
    };

    return (
        <Box data-name="prize-wheel" sx={{ backgroundColor: '#1A1F3D', borderRadius: '16px', p: '24px' }}>
            <Box sx={{mb: '16px'}}>
                <Typography variant="body1" color='textSecondary' sx={{display: 'block', mb: '8px', color: 'white'}}>Number of Winners:</Typography>
                <StyledTextField
                    type="text"
                     error={!isNumberValid}
                    value={winnerCount}
                    onChange={handleWinnerCountChange}
                    fullWidth
                />
            </Box>
              <Box sx={{position: 'relative', width: '192px', height: '192px', mx: 'auto', mb: '24px',
                    '& > div': {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '50%',
                        border: '4px solid #4F5AFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                   }
                  }}>
                 <Box>
                      <TrophyIcon sx={{fontSize: '64px', color: '#4F5AFF'}}/>
                    </Box>
              </Box>
           <StyledButton
                onClick={spinWheel}
              variant="contained"
             disabled={spinning || members.length === 0 || !isNumberValid}
                sx={{
                  opacity: (spinning || members.length === 0 || !isNumberValid) ? 0.5 : 1,
                     cursor: (spinning || members.length === 0 || !isNumberValid) ? 'not-allowed' : 'pointer',
                }}
           >
               {spinning ? 'Spinning...' : 'Spin Wheel'}
            </StyledButton>
       </Box>
    );
}

export default PrizeWheel;