import React from 'react';
import { ConfigProvider } from 'antd';
import { Box, useTheme } from '@mui/material';

/**
 * AntDesignWrapper component
 * 
 * This component serves as a style wrapper for Ant Design components
 * to integrate them seamlessly with Material-UI styled components.
 * 
 * It:
 * 1. Applies a consistent theme to Ant Design components
 * 2. Sets color variables based on the current Material-UI theme
 * 3. Provides additional style overrides to handle conflicts
 */
const AntDesignWrapper = ({ children }) => {
  const muiTheme = useTheme();
  
  // Convert Material-UI primary color to Ant Design theme color
  const primary = muiTheme.palette.primary.main;
  
  // Create a theme configuration for Ant Design
  const theme = {
    token: {
      colorPrimary: primary,
      colorLink: primary,
      borderRadius: 4,
      // Match Material-UI's font settings
      fontFamily: muiTheme.typography.fontFamily,
      fontSize: muiTheme.typography.fontSize,
    },
    components: {
      Button: {
        borderRadius: 4,
        paddingInline: 16,
      },
      Table: {
        borderRadius: 8,
      },
      Card: {
        borderRadius: 8,
      },
      Modal: {
        borderRadius: 8,
      }
    }
  };
  
  return (
    <Box 
      className="ant-design-wrapper" 
      sx={{
        // Apply global overrides for Ant Design elements within Material-UI
        '.ant-btn': {
          textTransform: 'none',  // Material-UI buttons use uppercase by default
        },
        '.ant-table': {
          fontSize: '0.875rem',
          marginBottom: 3,
        },
        '.ant-form-item-label > label': {
          fontSize: '0.875rem',
        },
        '.ant-select-selector, .ant-input, .ant-input-number': {
          borderRadius: '4px !important',
        },
        // Ensure Ant Design modals appear above Material-UI components
        '.ant-modal, .ant-drawer': {
          zIndex: theme => theme.zIndex.modal + 100,
        }
      }}
    >
      <ConfigProvider theme={theme}>
        {children}
      </ConfigProvider>
    </Box>
  );
};

export default AntDesignWrapper;
