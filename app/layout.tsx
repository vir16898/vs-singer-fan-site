import * as React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';
import { headers } from 'next/headers';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Get headers asynchronously
  const headersList = await headers();
  const pathname = headersList.get('x-invoke-path') || '/';

  const menuItems = [
    { label: 'New Release', href: '/new-release' },
    { label: 'Ranking', href: '/ranking' },
    { label: 'Search', href: '/search' },
    { label: 'My Collection', href: '/my-collection' },
  ];

  return (
    <html lang="en">
      <body>
        <AppBar position="static" className="bg-blue-600">
          <Toolbar>
            <Typography variant="h6" component="div" className="flex-grow">
              My App
            </Typography>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                component={Link}
                href={item.href}
                className={`hover:bg-blue-700 transition-colors duration-200 ${
                  pathname === item.href ? 'bg-blue-800' : ''
                }`}
              >
                {item.label}
              </Button>
            ))}
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" className="mt-4">
          {children}
        </Container>
      </body>
    </html>
  );
}