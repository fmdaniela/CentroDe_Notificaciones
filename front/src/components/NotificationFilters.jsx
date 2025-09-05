import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Button
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Clear as ClearIcon
} from "@mui/icons-material";
import { blueGrey } from "@mui/material/colors";

export default function NotificationFilters({ filters, onFilterChange, onClearFilters }) {
  return (
    <Box sx={{ 
      p: 2, 
      bgcolor: 'background.default', 
      borderRadius: 2, 
      mb: 3,
      border: '1px solid',
      borderColor: 'divider'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        flexWrap: 'wrap' 
      }}>
        {/* Filtro por estado */}
        <FormControl size="small" sx={{ minWidth: 120}}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={filters.status || ''}
            label="Estado"
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="unread">No leídos</MenuItem>
            <MenuItem value="read">Leídos</MenuItem>
          </Select>
        </FormControl>

        {/* Búsqueda por texto */}
        <TextField
          size="small"
          label="Buscar en mensajes"
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          sx={{ minWidth: 200 }}
        />

        {/* Botón limpiar */}
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={onClearFilters}
          disabled={!filters.status && !filters.search}
        >
          Limpiar
        </Button>

        {/* Chips de filtros activos */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {filters.status && (
            <Chip
              label={`Estado: ${filters.status === 'read' ? 'Leídos' : 'No leídos'}`}
              onDelete={() => onFilterChange('status', '')}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {filters.search && (
            <Chip
              label={`Buscar: ${filters.search}`}
              onDelete={() => onFilterChange('search', '')}
              size="small"
              color="secondary"
              variant="outlined"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}