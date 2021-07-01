import React, { useEffect, useState } from "react";
import { withStyles, useTheme, makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableFooter, TableRow, TablePagination, TableHead, Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import { SnackBarVariant, UserRoles } from "../../utils/constant";
import { getAllCourses } from "../../config/api/Courses";

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

const useStyles = makeStyles((theme) => ({
    marginAutoContainer: {
        width: 1000,
        height: 80,
        display: 'flex',
    },
    marginAutoItem: {
        margin: 'auto'
    },
    root: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
        marginTop: 24,
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',

    }
}));

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

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};


export default function ListCourseComponent() {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [isPending, setIsPending] = useState(false);
    const [courses, setCourses] = useState([]);
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalResults, setTotalResults] = useState(0);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        const eff = async () => {
            await getCourseList();
        }
        eff();
    }, []);


    const getCourseList = async () => {
        setIsPending(true);
        try {
            const courses = await getAllCourses(1, 1000);
            setTotalResults(courses.data.totalResults);
            setCourses(courses.data.results);
        } catch (e) {
            enqueueSnackbar("Error, can not get course list", { variant: SnackBarVariant.Error });
            console.log(e);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div>
            <Button style={{ marginBottom: 20 }} variant="contained" color="primary" onClick={() => this.addUser()}>
                Add course
            </Button>
            <div></div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, { label: 'All', value: -1 }]}
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
                    </TableRow>
                    <TableRow>
                        <StyledTableCell>#</StyledTableCell>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>Category</StyledTableCell>
                        <StyledTableCell>Teacher</StyledTableCell>
                        <StyledTableCell align="right"></StyledTableCell>
                        <StyledTableCell align="right"></StyledTableCell>
                    </TableRow>

                </TableHead>
                {
                    isPending ?
                        // <div className={classes.root}><CircularProgress /></div> :
                        <div className={classes.marginAutoContainer}>
                            <div className={classes.marginAutoItem}>
                                <CircularProgress />
                            </div>
                        </div> :
                        <TableBody>
                            {(rowsPerPage > 0
                                ? courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : courses
                            ).map((row, index) => (
                                <StyledTableRow key={row._id}>
                                    <StyledTableCell>{index}</StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row.name}
                                    </StyledTableCell>
                                    <StyledTableCell >{row.category}</StyledTableCell>
                                    <StyledTableCell >{row.teacher}</StyledTableCell>
                                    <StyledTableCell align="right"  style={{color:'blue'}} onClick={() => this.editUser(row.id)}><CreateIcon /></StyledTableCell>
                                    <StyledTableCell align="right" style={{color:'red'}} onClick={() => this.deleteUser(row.id)}><DeleteIcon /></StyledTableCell>

                                </StyledTableRow>
                            ))}
                        </TableBody>
                }
            </Table>

        </div>


    );
}

