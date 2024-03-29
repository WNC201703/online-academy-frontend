import React, { useEffect, useState } from "react";
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableRow, TableHead } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useSnackbar } from "notistack";
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { SnackBarVariant, UserRoles } from "../../../utils/constant";
import { getAllUser, deleteUser } from "../../../config/api/User";
import ConfirmationDialog from "../../../components/Dialog/ConfirmationDialog";
import AddTeacherDialog from "./AddTeacherDialog";
import EditTeacherDialog from "./EditTeacherDialog";

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

export default function ListTeacherComponent() {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(0);
    const [teachers, setTeachers] = useState([]);

    const [openDeleteDialog, setOpenDeleteDialog] = useState({
        isOpen: false,
    });

    const [openAddDialog, setOpenAddDialog] = useState(false);

    const [openEditDialog, setOpenEditDialog] = useState({
        isOpen: false,
    });


    const fetchData = async () => {
        setLoading(false);
        try {
            const response = await getAllUser(UserRoles.Teacher);
            if (response.status === 200) {
                let data = response.data;
                setTeachers(data);
            } else {
                console.log(response);
                enqueueSnackbar("Error, can not get teacher list", { variant: SnackBarVariant.Error });
            }
        } catch (e) {
            enqueueSnackbar("Error, can not get teacher list", { variant: SnackBarVariant.Error });
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [reload]); // eslint-disable-line react-hooks/exhaustive-deps

    const onDeleteTeacherClick = (id) => {
        setOpenDeleteDialog({
            isOpen: true,
            teacherId: id
        });
    }

    const handleDeleteTeacher = () => {
        const id = openDeleteDialog.teacherId;
        setOpenDeleteDialog({
            isOpen: false,
        });
        deleteUser(id).then((response) => {
            if (response.status === 204) {
                for (let i = 0; i < teachers.length; i++) {
                    if (teachers[i]._id === id) teachers.splice(i, 1);
                }
                setLoading(true);
                setTeachers(teachers);
                setLoading(false);
                enqueueSnackbar("Teacher deleted successfully", { variant: SnackBarVariant.Success });
            } else {
                enqueueSnackbar(`Delete failed ${response.data?.error_message ? `:${response.data?.error_message}` : ''}`, { variant: SnackBarVariant.Error });
            }
        }).catch((err) => {
            enqueueSnackbar("Delete failed", { variant: SnackBarVariant.Error });
        });
    }

    const onEditTeacherClick = (teacher) => {
        setOpenEditDialog({
            isOpen: true,
            teacher: teacher
        });
    }


    return (
        <>
            <div  style={{ padding: 20 }}>
                <Button style={{ marginBottom: 20 }} variant="contained" color="primary" onClick={() => { setOpenAddDialog(true) }}>
                    Add teacher
                </Button>
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
                            teachers
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
                                        <StyledTableCell align="right" style={{ color: 'blue' }} onClick={() => onEditTeacherClick(row)}><CreateIcon /></StyledTableCell>
                                        <StyledTableCell align="right" style={{ color: 'red' }} onClick={() => onDeleteTeacherClick(row._id)}><DeleteIcon /></StyledTableCell>

                                    </StyledTableRow>
                                ))}
                    </TableBody>
                </Table>

            </div>

            <ConfirmationDialog
                show={openDeleteDialog.isOpen}
                title='Delete teacher'
                detail='Are you sure you want to delete this teacher?'
                warning='This action will delete all teacher courses!!!'
                cancel={
                    () => { setOpenDeleteDialog({ isOpen: false, id: null }); }
                }
                confirm={handleDeleteTeacher}
            ></ConfirmationDialog>

            <AddTeacherDialog
                show={openAddDialog}
                cancel={
                    () => { setOpenAddDialog(false) }
                }
                success={
                    () => {
                        enqueueSnackbar("Teacher was added successfully", { variant: SnackBarVariant.Success });
                        setReload(reload + 1);
                    }
                }

                fail={
                    (message) => { enqueueSnackbar(`Failed to create new teacher ${message ? `: ${message}` : ''}`, { variant: SnackBarVariant.Error }); }
                }
            ></AddTeacherDialog>

            <EditTeacherDialog
                show={openEditDialog.isOpen}
                teacher={openEditDialog.teacher}
                cancel={
                    () => { setOpenEditDialog(false) }
                }

                success={
                    () => {
                        enqueueSnackbar("Teacher was updated successfully", { variant: SnackBarVariant.Success });
                        setReload(reload + 1);
                    }
                }
                fail={
                    () => { enqueueSnackbar("Failed to update category", { variant: SnackBarVariant.Error }); }
                }
            ></EditTeacherDialog>
        </>

    );
}

