'use client';

import * as React from 'react';
import { Tabs, Tab, Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

interface VideoData {
  title: string;
  videoId: string;
  views: string;
  publishedAt: string;
}

interface VideoTabsProps {
  harunoSoraVideos: VideoData[];
  hiyamaKiyoteruVideos: VideoData[];
  frimomenVideos: VideoData[];
}

function TabPanel(props: { children: React.ReactNode; value: number; index: number }) {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box className="p-3">{children}</Box>}
    </div>
  );
}

export default function VideoTabs({
  harunoSoraVideos,
  hiyamaKiyoteruVideos,
  frimomenVideos,
}: VideoTabsProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const renderTable = (videos: VideoData[]) => {
    if (videos.length === 0) {
      return <Typography>No videos found for this week.</Typography>;
    }

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Video Title</TableCell>
            <TableCell>Embed Video</TableCell>
            <TableCell>Total Views</TableCell>
            <TableCell>Uploaded Date Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {videos.map((video, index) => (
            <TableRow key={index}>
              <TableCell>{video.title}</TableCell>
              <TableCell>
                <iframe
                  width="320"
                  height="180"
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </TableCell>
              <TableCell>{parseInt(video.views).toLocaleString()}</TableCell>
              <TableCell>{new Date(video.publishedAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Box>
      <Tabs value={value} onChange={handleChange} aria-label="video tabs">
        <Tab label="Haruno Sora" />
        <Tab label="Hiyama Kiyoteru" />
        <Tab label="Frimomen" />
      </Tabs>
      <TabPanel value={value} index={0}>
        {renderTable(harunoSoraVideos)}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {renderTable(hiyamaKiyoteruVideos)}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {renderTable(frimomenVideos)}
      </TabPanel>
    </Box>
  );
}