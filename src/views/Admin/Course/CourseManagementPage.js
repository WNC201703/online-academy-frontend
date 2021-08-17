import React, { useCallback, useEffect, useState } from "react";
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableFooter, TableRow, TablePagination, TableHead, Grid } from '@material-ui/core';
import { useSnackbar } from "notistack";
import Skeleton from "@material-ui/lab/Skeleton";
import DeleteIcon from '@material-ui/icons/Delete';
import debounce from "@material-ui/core/utils/debounce";
import { SnackBarVariant } from "../../../utils/constant";
import { getAllCourses, deleteCourse } from "../../../config/api/Courses";
import { getAllCategories } from "../../../config/api/Categories";
import Rating from '@material-ui/lab/Rating';
import ConfirmationDialog from "../../../components/Dialog/ConfirmationDialog";
import TablePaginationActions from '../../../components/TablePaginationActions'
import { FormControl, InputLabel, Select, MenuItem, TextField } from "@material-ui/core";
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 13,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

export default function ListCourseComponent() {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalResults, setTotalResults] = useState(0);
    const [search, setSearch] = useState();
    const [category, setCategory] = useState();
    const [categories, setCategories] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState({
        isOpen: false,
        id: null
    });


    const fetchData = async (loading) => {
        setLoading(loading);
        try {
            const response = await getAllCourses(page + 1, rowsPerPage === -1 ? 0 : rowsPerPage, 'reviews', '', category, search);
            if (!categories || categories.length < 1) {
                const categoriesRes = await getAllCategories();
                if (categoriesRes.status === 200) {
                    const data = categoriesRes?.data;
                    setCategories(data);
                }
            }
            if (response.status === 200) {
                const data = response.data;
                setTotalResults(data.totalResults);
                setCourses(data.results);
            } else {
                console.log(response);
                enqueueSnackbar("Error, can not get course list", { variant: SnackBarVariant.Error });
            }
        } catch (e) {
            enqueueSnackbar("Error, can not get course list", { variant: SnackBarVariant.Error });
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const showCircularProgress = true;
        fetchData(showCircularProgress);
    }, [page, rowsPerPage, category, search]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const onDeleteCourseClick = (id) => {
        setOpenDeleteDialog({
            isOpen: true,
            id: id
        });
    }

    const handleCloseDialog = () => {
        setOpenDeleteDialog({
            isOpen: false,
            id: null
        });
    }

    const handleDeleteCourse = () => {
        const id = openDeleteDialog.id;
        setOpenDeleteDialog({
            isOpen: false,
        });
        deleteCourse(id).then((response) => {
            if (response.status === 204) {
                for (let i = 0; i < courses.length; i++) {
                    if (courses[i]._id === id) courses.splice(i, 1);
                }
                setTotalResults(totalResults - 1);
                setCourses(courses);
                enqueueSnackbar("Course deleted successfully", { variant: SnackBarVariant.Success });
            } else {
                enqueueSnackbar("Delete failed", { variant: SnackBarVariant.Error });
            }
        }).catch((err) => {
            enqueueSnackbar("Delete failed", { variant: SnackBarVariant.Error });
        });

    }

    const handleChangeCategory = (event) => {
        setPage(0);
        setCategory(event.target.value);
    };

    const handleSearchInputChange = (event) => {
        debounceSearchRequest(event.target.value);
    };
    const debounceSearchRequest = useCallback(debounce((nextValue) => setSearch(nextValue), 300), []);


    const loadingTable = () => {
        var rows = [];
        for (var i = 0; i < rowsPerPage; i++) (
            rows.push(<StyledTableRow>
                <StyledTableCell><Skeleton /></StyledTableCell>
                <StyledTableCell><Skeleton /></StyledTableCell>
                <StyledTableCell><Skeleton /></StyledTableCell>
                <StyledTableCell><Skeleton /></StyledTableCell>
                <StyledTableCell><Skeleton /></StyledTableCell>
                <StyledTableCell><Skeleton /></StyledTableCell>
                <StyledTableCell><Skeleton /></StyledTableCell>
            </StyledTableRow>)
        );
        return rows;
    }


    return (
        <>
            <div>
                <Grid style={{ marginBottom: 30 }} container justify="flex-end">
                    <TextField
                        style={{ marginRight: 10, width: 300 }}
                        id="outlined-search-input"
                        label="Search by teacher name"
                        onChange={handleSearchInputChange}
                        type="text"
                        variant="outlined"
                    />
                    <FormControl style={{ width: 250 }} variant="outlined" >
                        <InputLabel id="demo-simple-select-outlined-label">Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={category}
                            onChange={handleChangeCategory}
                            label="Category"
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {categories.map((option) => {
                                if (option.children) {
                                    let cps = [];
                                    cps.push((<MenuItem disabled key={option._id} value={option._id}>
                                        {option.name}
                                    </MenuItem>));
                                    cps.push(option.children.map(
                                        (subItem) => ((<MenuItem key={subItem._id} value={subItem._id}>
                                            {subItem.name}
                                        </MenuItem>))));
                                    return cps;
                                }

                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell style={{ width: '10%' }}>#</StyledTableCell>
                            <StyledTableCell style={{ width: '25%' }}>Name</StyledTableCell>
                            <StyledTableCell style={{ width: '10%' }}>Rating</StyledTableCell>
                            <StyledTableCell style={{ width: '20%' }}>Category</StyledTableCell>
                            <StyledTableCell style={{ width: '15%' }}>Teacher</StyledTableCell>
                            <StyledTableCell style={{ width: '15%' }}>Created at</StyledTableCell>
                            <StyledTableCell style={{ width: '5%' }} align="right">Delete</StyledTableCell>
                        </TableRow>

                    </TableHead>


                    <TableBody>
                        {loading ?
                            loadingTable()
                            :
                            courses
                                .map((row, index) => (
                                    <StyledTableRow key={row._id}>
                                        <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>
                                        <StyledTableCell component="th">{row.name} ({row.numberOfReviews})</StyledTableCell>
                                        <StyledTableCell ><Rating precision={0.5} name="read-only" value={row.averageRating / 2} readOnly /></StyledTableCell>
                                        <StyledTableCell >{row.category}</StyledTableCell>
                                        <StyledTableCell >{row.teacher}</StyledTableCell>
                                        <StyledTableCell >{row.createdAt}</StyledTableCell>
                                        <StyledTableCell align="right" style={{ color: 'red' }} onClick={() => onDeleteCourseClick(row._id)}><DeleteIcon /></StyledTableCell>

                                    </StyledTableRow>
                                ))}
                    </TableBody>

                    <TableFooter>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={5}
                            count={totalResults}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableFooter>
                </Table>

            </div>

            <ConfirmationDialog
                show={openDeleteDialog.isOpen}
                title='Delete course'
                detail='Are you sure you want to delete this course?'
                cancel={() => { handleCloseDialog() }}
                confirm={() => { handleDeleteCourse() }}
            ></ConfirmationDialog>
        </>

    );
}

