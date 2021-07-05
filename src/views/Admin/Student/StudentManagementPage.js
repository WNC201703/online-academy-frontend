import React, { useEffect, useState } from "react";
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableRow, TableHead } from '@material-ui/core';
import { useSnackbar } from "notistack";
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { SnackBarVariant, UserRoles } from "../../../utils/constant";
import { getAllUser, deleteUser } from "../../../config/api/User";
import ConfirmationDialog from "../../../components/Dialog/ConfirmationDialog";
import EditStudentDialog from "./EditStudentDialog";

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

export default function ListStudentComponent() {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(0);
    const [students, setStudents] = useState([]);

    const [openDeleteDialog, setOpenDeleteDialog] = useState({
        isOpen: false,
    });

    const [openEditDialog, setOpenEditDialog] = useState({
        isOpen: false,
    });


    const fetchData = async () => {
        setLoading(false);
        try {
            const response = await getAllUser(UserRoles.Student);
            if (response.status === 200) {
                let data = response.data;
                setStudents(data);
            } else {
                console.log(response);
                enqueueSnackbar("Error, can not get student list", { variant: SnackBarVariant.Error });
            }
        } catch (e) {
            enqueueSnackbar("Error, can not get student list", { variant: SnackBarVariant.Error });
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [reload]); // eslint-disable-line react-hooks/exhaustive-deps

    const onDeleteStudentClick = (id) => {
        setOpenDeleteDialog({
            isOpen: true,
            studentId: id
        });
    }

    const handleDeleteStudent = () => {
        const id = openDeleteDialog.studentId;
        setOpenDeleteDialog({
            isOpen: false,
        });
        deleteUser(id).then((response) => {
            if (response.status === 204) {
                for (let i = 0; i < students.length; i++) {
                    if (students[i]._id === id) students.splice(i, 1);
                }
                setLoading(true);
                setStudents(students);
                setLoading(false);
                enqueueSnackbar("Student deleted successfully", { variant: SnackBarVariant.Success });
            } else {
                console.log(response.error_message);
                enqueueSnackbar(`Delete failed ${response.error_message ? `:${response.error_message}` : ''}`, { variant: SnackBarVariant.Error });
            }
        }).catch((err) => {
            enqueueSnackbar("Delete failed", { variant: SnackBarVariant.Error });
        });
    }

    const onEditStudentClick = (student) => {
        setOpenEditDialog({
            isOpen: true,
            student: student
        });
    }


    return (
        <>
            <div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell style={{ width: '10%' }}>#</StyledTableCell>
                            <StyledTableCell style={{ width: '20%' }}>Email</StyledTableCell>
                            <StyledTableCell style={{ width: '15%' }}>Full name</StyledTableCell>
                            <StyledTableCell style={{ width: '25%' }}>Created At</StyledTableCell>
                            <StyledTableCell style={{ width: '5%' }} align="right">Edit</StyledTableCell>
                            <StyledTableCell style={{ width: '5%' }} align="right">Delete</StyledTableCell>
                        </TableRow>

                    </TableHead>


                    <TableBody>
                        {loading ?
                            <StyledTableRow >
                                {/* <CircularProgress /> */}
                            </StyledTableRow>
                            :
                            students
                                .map((row, index) => (
                                    <StyledTableRow key={row._id} className='tableRow'>
                                        <StyledTableCell >
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell  >
                                            {row.email}
                                        </StyledTableCell>
                                        <StyledTableCell >{row.fullname}</StyledTableCell>
                                        <StyledTableCell >{row.createdAt}</StyledTableCell>
                                        <StyledTableCell align="right" style={{ color: 'blue' }} onClick={() => onEditStudentClick(row)}><CreateIcon /></StyledTableCell>
                                        <StyledTableCell align="right" style={{ color: 'red' }} onClick={() => onDeleteStudentClick(row._id)}><DeleteIcon /></StyledTableCell>

                                    </StyledTableRow>
                                ))}
                    </TableBody>
                </Table>

            </div>

            <ConfirmationDialog
                show={openDeleteDialog.isOpen}
                title='Delete student'
                detail='Are you sure you want to delete this student?'
                warning='This action will delete all student courses!!!'
                cancel={
                    () => { setOpenDeleteDialog({ isOpen: false, id: null }); }
                }
                confirm={handleDeleteStudent}
            ></ConfirmationDialog>


            <EditStudentDialog
                show={openEditDialog.isOpen}
                student={openEditDialog.student}
                cancel={
                    () => { setOpenEditDialog(false) }
                }

                success={
                    () => {
                        enqueueSnackbar("Student was updated successfully", { variant: SnackBarVariant.Success });
                        setReload(reload + 1);
                    }
                }
                fail={
                    () => { enqueueSnackbar("Failed to update category", { variant: SnackBarVariant.Error }); }
                }
            ></EditStudentDialog>
        </>

    );
}

