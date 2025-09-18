import { Box, type BoxProps } from '@mui/material';
import { Icon } from '@iconify/react';

interface IconifyProps extends BoxProps {
  icon: string; // أو نوع أوسع حسب المكتبة
  width?: string | number;
  height?: string | number;
  color?: string;
}

const IconifyIcon = ({ icon, width, height, color, ...rest }: IconifyProps) => {
  return (
    <Box
      component={Icon}
      icon={icon}
      width={width}
      height={height}
      color={color}
      {...rest}
    />
  );
};

export default IconifyIcon;
