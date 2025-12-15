import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline
} from '@mui/material';
import { CalendarToday, BarChart, Category, Tag } from '@mui/icons-material';

const drawerWidth = 240;

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { text: 'Calendar', path: '/', icon: <CalendarToday /> },
    { text: 'Statistics', path: '/stats', icon: <BarChart /> },
    { text: 'Category Config', path: '/categories', icon: <Category /> },
    { text: 'Tag Config', path: '/tags', icon: <Tag /> },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Activity Tracker
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            position: 'relative',
            height: '100vh'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', height: 'calc(100vh - 64px)' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      },
                    },
                  }}
                >
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </Box>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          height: '100vh'
        }}
      >
        <Toolbar />
        <Box
          sx={{ 
            flexGrow: 1,
            overflow: 'auto',
            p: 2,
            minHeight: 0,
            minWidth: 800,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;