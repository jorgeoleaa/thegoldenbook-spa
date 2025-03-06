import { Card, CardContent, CardMedia, Typography } from "@mui/material";

interface LibroCardProps {
  title: string;
  price: number;
  imageUrl?: string;  
}

const LibroCard: React.FC<LibroCardProps> = ({ title, price, imageUrl }) => {
  return (
    <Card sx={{ maxWidth: 250, boxShadow: 3, borderRadius: 2 }}>
      <CardMedia
        component="img"
        height="140"
        alt={title}
        image={imageUrl || "../src/assets/imgs/no_image.webp"}
      />
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          ${price}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default LibroCard;