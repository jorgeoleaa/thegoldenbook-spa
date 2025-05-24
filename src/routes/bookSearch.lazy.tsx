import React, { useState, useEffect } from 'react';
import {
    Grid,
    TextField,
    ThemeProvider,
    Button,
    FormControlLabel,
    Box,
    Slider,
    FormGroup,
    Checkbox,
    Autocomplete,
    Pagination,
    Typography,
    Paper,
} from '@mui/material';
import { DefaultApi, FindBooksByCriteriaRequest, FindLanguagesByLocaleRequest, FindReadingAgeGroupsByLocaleRequest, LiteraryGenre, FindLiteraryGenresByLocaleRequest} from '../services/proxy/generated';
import { Book, Language, ReadingAgeGroup } from '../services/proxy/generated/models';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import BookCard from '../components/BookCard';
import theme from '../themes/themes';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/bookSearch')({
    component: BookSearch,
});

function BookSearch() {
    const api = new DefaultApi();

    const locale: FindLanguagesByLocaleRequest | FindReadingAgeGroupsByLocaleRequest | FindLiteraryGenresByLocaleRequest = {
        locale: "es_ES"
    };

    const [value, setValue] = useState<number[]>([10, 50]);
    const [loading, setLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string | undefined>("");
    const [books, setBooks] = useState<Book[]>([]);
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [languages, setLanguages] = useState<Language[] | undefined>(undefined);
    const [selected, setSelected] = useState<number | null>(null);
    const [languageId, setLanguageId] = useState<number | undefined>(undefined);
    const [readingAgeGroup, setReadingAgeGroup] = useState<ReadingAgeGroup[] | undefined>(undefined);
    const [readingAgeGroupId, setReadingAgeGroupId] = useState<number | undefined>(undefined);
    //const [literaryGenres, setLiteraryGenres] = useState<LiteraryGenre[] | undefined>(undefined);
    const [page, setPage] = useState<number>(1);
    const [rowsPerPage] = useState<number>(12);

    async function fetchBooks() {
        setLoading(true);
        const BookCriteria: FindBooksByCriteriaRequest = {
            title: title,
            locale: "es_ES",
            minPrice: minPrice,
            maxPrice: maxPrice,
            startDate: startDate,
            endDate: endDate,
            languageId: languageId,
            readingAgeGroupId: readingAgeGroupId,
        };
        setBooks(await api.findBooksByCriteria(BookCriteria));
        setLoading(false);
    };

    async function fetchLanguages() {
        const languages = await api.findLanguagesByLocale(locale);
        setLanguages(languages);
    }

    async function fetchReadingAgeGroups() {
        const readingAgeGroups = await api.findReadingAgeGroupsByLocale(locale);
        setReadingAgeGroup(readingAgeGroups);
    }

    // async function fetchLiteraryGenres() {
    //     const literaryGenres = await api.findLiteraryGenresByLocale(locale);
    //     setLiteraryGenres(literaryGenres);
    // }

    useEffect(() => {
        fetchLanguages();
        fetchReadingAgeGroups();
        // fetchGeneros();
    }, []);

    function valueText(value: number) {
        return `${value}€`;
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
        setMinPrice((newValue as number[])[0]);
        setMaxPrice((newValue as number[])[1]);
    };

    const handleLanguageChange = (index: number, idiomaId: number | undefined) => {
        setSelected(index);
        setLanguageId(idiomaId);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const paginatedBooks = books.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '100%', p: 3 }}>
                <Grid container spacing={4}>
                    {/* Filtros */}
                    <Grid item xs={12} md={3}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Filters
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    label="Search book"
                                    variant="outlined"
                                    fullWidth
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Price range
                                </Typography>
                                <Slider
                                    getAriaLabel={() => 'Price range'}
                                    value={value}
                                    onChange={handleSliderChange}
                                    valueLabelDisplay="auto"
                                    getAriaValueText={valueText}
                                    max={500}
                                />
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Publication date
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={startDate ? dayjs(startDate) : null}
                                        onChange={(newStartDate) => setStartDate(newStartDate?.startOf('day').toDate())}
                                        label="From date"
                                        sx={{ mb: 2, width: '100%' }}
                                    />
                                    <DatePicker
                                        value={endDate ? dayjs(endDate) : null}
                                        onChange={(newEndDate) => setEndDate(newEndDate?.startOf('day').toDate())}
                                        label="End date"
                                        sx={{ width: '100%' }}
                                    />
                                </LocalizationProvider>
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Language
                                </Typography>
                                <FormGroup>
                                    {languages?.map((language, index) => (
                                        <FormControlLabel
                                            key={language.id}
                                            control={
                                                <Checkbox
                                                    checked={selected === index}
                                                    onChange={() => handleLanguageChange(index, language.id)}
                                                />
                                            }
                                            label={language.name}
                                        />
                                    ))}
                                </FormGroup>
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Reading Age Groups
                                </Typography>
                                <Autocomplete
                                    disablePortal
                                    options={readingAgeGroup || []}
                                    getOptionLabel={(option) => option.name || ""}
                                    onChange={(e, newValue) => setReadingAgeGroupId(newValue?.id)}
                                    sx={{ width: '100%' }}
                                    renderInput={(params) => <TextField {...params} label="Reading age groups" />}
                                />
                            </Box>
                            {/* <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Literary Genres
                                </Typography>
                                <Autocomplete
                                    disablePortal
                                    options={literaryGenres || []}
                                    getOptionLabel={(option) => option.name || ""}
                                    onChange={(e, newValue) => setLiteraryGenreId(newValue?.id)}
                                    sx={{ width: '100%' }}
                                    renderInput={(params) => <TextField {...params} label="Literary Genre" />}
                                />
                            </Box> */}
                            <Button variant="contained" color="primary" fullWidth onClick={fetchBooks}>
                                Search
                            </Button>
                        </Paper>
                    </Grid>

                    {/* Results */}
                    <Grid item xs={12} md={9}>
                        {loading ? (
                            <Typography variant="h6" align="center">
                                Loading...
                            </Typography>
                        ) : books.length === 0 ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '50vh',
                                }}
                            >
                                <Typography variant="h5" color="textSecondary">
                                    Perform a search to see the results.
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                <Grid container spacing={3}>
                                    {paginatedBooks.map((book) => (
                                        <Grid item xs={12} sm={6} md={3} key={book.id}>
                                            <BookCard book={book} />
                                        </Grid>
                                    ))}
                                </Grid>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <Pagination
                                        count={Math.ceil(books.length / rowsPerPage)}
                                        page={page}
                                        onChange={handlePageChange}
                                        variant="outlined"
                                        shape="rounded"
                                    />
                                </Box>
                            </>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
}

export default BookSearch;