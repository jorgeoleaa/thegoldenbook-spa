import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Chip,
    Divider,
    Rating,
    Box,
    Button,
} from '@mui/material';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { Book, Author, Subject, Review, FindReviewsByBookRequest, CreateReviewRequest, DeleteReviewRequest } from '../services/proxy/generated';
import { createLazyFileRoute } from '@tanstack/react-router';
import { DefaultApi } from '../services/proxy/generated';
import { HistoryState } from '@tanstack/react-router';
import ReviewDialog from '../components/ReviewDialog';
import { User } from '../services/proxy/generated';

export const Route = createLazyFileRoute('/bookDetail')({
    component: BookDetail,
})

type BookNavigationState = HistoryState & {
    book: Book;
};

function BookDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const api = new DefaultApi();

    const user: User | null = JSON.parse(sessionStorage.getItem('authenticatedUser') || 'null');

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const book = (location.state as unknown as BookNavigationState)?.book;

    useEffect(() => {
        if (book) {
            const fetchReviews = async () => {
                try {
                    const request: FindReviewsByBookRequest = { bookId: book.id, locale: 'es_ES' };
                    const response = await api.findReviewsByBook(request);
                    setReviews(response);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching reviews:', error);
                    setLoading(false);
                }
            };

            const fetchImages = async () => {
                try {
                    const blob = await api.getImageByBookId({ bookId: book.id!, locale: 'es_ES' });
                    setImageUrl(URL.createObjectURL(blob));
                } catch (error) {
                    console.error("Error retrieving the images: ", error);
                }
            };

            fetchReviews();
            fetchImages();
        }
    }, [book]);

    const handleAddRatingClick = () => {
        if (!user) {
            navigate({ to: '/login' });
        } else {
            setDialogOpen(true);
        }
    };

    async function handleSaveRating(ratingData: { rating: number; subject: string; body: string }) {
        const createdReview: Review = {
            subject: ratingData.subject,
            body: ratingData.body,
            rating: ratingData.rating,
            bookId: book.id,
            userId: user?.id,
            languageId: 2
        };

        const createReviewRequest: CreateReviewRequest = {
            locale: "es_ES",
            review: createdReview,
        };

        await api.createReview(createReviewRequest);

        const bookRequest: FindReviewsByBookRequest = { bookId: book.id, locale: 'es_ES' };
        const updatedReviews = await api.findReviewsByBook(bookRequest);
        setReviews(updatedReviews);

        console.log('Saved review:', ratingData);
        setDialogOpen(false);
    };

    const handleDeleteRating = async () => {
        try {
            const deleteReviewRequest: DeleteReviewRequest = {
                bookId: book.id,
                userId: user?.id
            };

            await api.deleteReview(deleteReviewRequest);
            const bookRequest: FindReviewsByBookRequest = { 
                bookId: book.id,
                locale: 'es_ES'
             };
            const updatedReviews = await api.findReviewsByBook(bookRequest);
            setReviews(updatedReviews);
        } catch (error) {
            console.error('Error deleting the review: ', error);
        }
    };

    if (!book) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    The book was not found.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Card>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    {/* Book images */}
                    <Box sx={{ width: { xs: '100%', md: '30%' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <CardMedia
                            key={book.id}
                            component="img"
                            image={imageUrl}
                            alt={`Book Image ${book.id! + 1}`}
                            sx={{ borderRadius: 2, height: '100%', objectFit: 'contain' }} 
                        />
                    </Box>

                    <Box sx={{ width: { xs: '100%', md: '70%' } }}>
                        <CardContent>
                            <Typography variant="h3" component="h1" gutterBottom>
                                {book.title}
                            </Typography>

                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                Por: {book.authors?.map((author: Author) =>
                                    `${author.name} ${author.lastName} ${author.secondLastName || ""}`
                                ).join(', ')}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Rating
                                    value={book.averageRating || 0}
                                    precision={0.5}
                                    readOnly
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    ({book.averageRating?.toFixed(1)})
                                </Typography>
                            </Box>

                            <Typography variant="body1" paragraph>
                                {book.synopsis}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Publication date
                                    </Typography>
                                    <Typography variant="body1">
                                        {book.publicationDate?.toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Literary Genre
                                    </Typography>
                                    <Typography variant="body1">
                                        {book.literaryGenres?.[0]?.name}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Reading Age Group
                                    </Typography>
                                    <Typography variant="body1">
                                        {book.readingAgeGroupName}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Language
                                    </Typography>
                                    <Typography variant="body1">
                                        {book.languageName}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Format
                                    </Typography>
                                    <Typography variant="body1">
                                        {book.formatName}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Price
                                    </Typography>
                                    <Typography variant="body1">
                                        ${book.price?.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Subjects:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {book.subjects?.map((subject: Subject) => (
                                    <Chip
                                        key={subject.id}
                                        label={subject.name}
                                        color="primary"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h5" component="h2" gutterBottom>
                                Reviews
                            </Typography>
                            {loading ? (
                                <Typography variant="body1">Loading reviews...</Typography>
                            ) : reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <Box key={`${review.userId}-${review.bookId}`} sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle1" component="h3">
                                                {review.subject}
                                            </Typography>
                                            {user && review.userId === user.id && (
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleDeleteRating()}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </Box>
                                        <Rating
                                            value={review.rating || 0}
                                            precision={1}
                                            readOnly
                                            sx={{ mb: 1 }}
                                        />
                                        <Typography variant="body1">
                                            {review.body}
                                        </Typography>
                                        <Divider sx={{ my: 1 }} />
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body1">There are no ratings for this book.</Typography>
                            )}

                            {/* Add review button */}
                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="contained" color="primary" onClick={handleAddRatingClick}>
                                    Add review
                                </Button>
                            </Box>
                        </CardContent>
                    </Box>
                </Box>
            </Card>

            {/* Add review dialog */}
            <ReviewDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSave={handleSaveRating}
            />
        </Container>
    );
}

export default BookDetail;