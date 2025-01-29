import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

const StyledMemberCard = styled(Box)(({ theme }) => ({
    borderRadius: '12px',
    transition: 'all 0.3s ease',
     padding: theme.spacing(2),
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    },
    }));


const Avatar = styled(Box)(({ theme }) => ({
   borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
}));

const ProgressBar = styled(Box)(({ theme }) => ({
    borderRadius: '4px',
    height: '8px',
    overflow: 'hidden',
}));

const ProgressBarFill = styled(Box)(({ theme, progress }) => ({
    height: '100%',
    width: `${progress}%`,
    transition: 'width 0.3s ease',
}));

function MemberCard({ member, onSelect }) {
    const progress = (member.score / 1000) * 100;
    return (
        <StyledMemberCard
            data-name="member-card"
            onClick={onSelect}
            className="member-card"
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar className="avatar">
                    <i className="fas fa-user"></i>
                </Avatar>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {member.username}
                    </Typography>

                </Box>
            </Box>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#8890B5' }}>
                        Score
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4F5AFF' }}>
                        {member.score}
                    </Typography>
                </Box>
                <ProgressBar className="progress-bar">
                   <ProgressBarFill className="progress-bar-fill" progress={progress} />
                </ProgressBar>
            </Box>
        </StyledMemberCard>
    );
}

export default MemberCard;