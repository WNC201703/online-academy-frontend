import React, { useEffect, useState } from "react";
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableFooter, TableRow, TablePagination, TableHead } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useSnackbar } from "notistack";
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { SnackBarVariant } from "../../utils/constant";
import { getAllCourses, deleteCourse } from "../../config/api/Courses";
import Rating from '@material-ui/lab/Rating';
import ConfirmationDialog from "../../components/Dialog/ConfirmationDialog";
import TablePaginationActions from './TablePaginationActions'

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
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
    const [backgroundUpdate, setBackgroundUpdate] = useState();
    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalResults, setTotalResults] = useState(0);
    const [openDeleteDialog, setOpenDeleteDialog] = useState({
        isOpen: false,
        id: null
    });

    useEffect(() => {
        const showCircularProgress=true;
        fetchData(showCircularProgress);
    }, [page, rowsPerPage]);

    useEffect(() => {
    }, [courses]);

    useEffect(() => {
        const showCircularProgress=false;
        fetchData(showCircularProgress);
    }, [backgroundUpdate]);

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
                setBackgroundUpdate(id);
                enqueueSnackbar("Course deleted successfully", { variant: SnackBarVariant.Success });
            } else {
                enqueueSnackbar("Delete failed", { variant: SnackBarVariant.Error });
            }
        }).catch((err) => {
            enqueueSnackbar("Delete failed", { variant: SnackBarVariant.Error });
        });

    }


    const editUser = (userId) => {

    }

    const fetchData = async (loading) => {
        setLoading(loading);
        try {
            const response = await getAllCourses(page + 1, rowsPerPage === -1 ? 0 : rowsPerPage);
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

    return (
        <>
            <div>
                <Button style={{ marginBottom: 20 }} variant="contained" color="primary" onClick={() => this.addUser()}>
                    Add course
                </Button>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell style={{ width: '10%' }}>#</StyledTableCell>
                            <StyledTableCell style={{ width: '30%' }}>Name</StyledTableCell>
                            <StyledTableCell style={{ width: '10%' }}>Rating</StyledTableCell>
                            <StyledTableCell style={{ width: '20%' }}>Category</StyledTableCell>
                            <StyledTableCell style={{ width: '20%' }}>Teacher</StyledTableCell>
                            <StyledTableCell style={{ width: '3%' }} align="right">Edit</StyledTableCell>
                            <StyledTableCell style={{ width: '3%' }} align="right">Delete</StyledTableCell>
                        </TableRow>

                    </TableHead>


                    <TableBody>
                        {loading ?
                            <StyledTableRow>
                                {/* <CircularProgress /> */}
                            </StyledTableRow>
                            :
                            courses
                                .map((row, index) => (
                                    <StyledTableRow key={row._id}>
                                        <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>
                                        <StyledTableCell component="th">{row.name}</StyledTableCell>
                                        <StyledTableCell ><Rating precision={0.5} name="read-only" value={row.averageRating / 2} readOnly /></StyledTableCell>
                                        <StyledTableCell >{row.category}</StyledTableCell>
                                        <StyledTableCell >{row.teacher}</StyledTableCell>
                                        <StyledTableCell align="right" style={{ color: 'blue' }} onClick={() => editUser(row._id)}><CreateIcon /></StyledTableCell>
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

