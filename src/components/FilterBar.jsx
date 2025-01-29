import React, { useState, useRef, useEffect } from 'react';
import { reportError } from '../utils/api';
import { styled } from '@mui/material/styles';
import { Box, Button, TextField, Select, MenuItem } from '@mui/material';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: theme.palette.background.paper,
        color: '#C89B3C',
    },
    '& label': {
        color: theme.palette.primary.contrastText,
    },
    '& .MuiInputBase-input': {
        color: 'white'
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
    }
}));


const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '8px',
    padding: '12px 24px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

function FilterBar({ onFilter }) {
    const [filters, setFilters] = useState({
        minScore: '',
        maxScore: '',
        rankFilter: ''
    });

  const inputRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    
    useEffect(() => {
     if (inputRef.current && isFocused) {
      inputRef.current.focus();
      }
     }, [isFocused]);
     
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleBlur = () => {
        setIsFocused(false);
    };
    const handleFocus = () => {
        setIsFocused(true);
    };
    const applyFilters = () => {
        try {
            onFilter(filters);
        } catch (error) {
            reportError(error);
        }
    };


      const handleKeyDown = (event) => {
        if (event.key === ' ') {
          event.preventDefault();
        }
      };

    return (
        <Box
            data-name="filter-bar"
            sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 4}}
            onBlur={handleBlur}
          onFocus={handleFocus}
            tabIndex={0}
        >
            <StyledTextField
                type="number"
                name="minScore"
                label="Min Score"
                variant="outlined"
                value={filters.minScore}
                onChange={handleFilterChange}
                sx={{maxWidth: '150px'}}
                  onKeyDown={handleKeyDown}
             inputRef={inputRef}
            />
           
       
            <StyledButton
                onClick={applyFilters}
            >
                Apply Filters
            </StyledButton>
        </Box>
    );
}

export default FilterBar;