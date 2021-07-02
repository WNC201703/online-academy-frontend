import React, { useEffect, useState } from "react";
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableRow, TableHead } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useSnackbar } from "notistack";
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { SnackBarVariant } from "../../utils/constant";
import { getAllCategories, deleteCategory } from "../../config/api/Categories";
import ConfirmationDialog from "../../components/Dialog/ConfirmationDialog";

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

export default function ListCategoryComponent() {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState({
        isOpen: false,
        id: null
    });

    useEffect(() => {
        fetchData();
    }, []);

    const onDeleteCategoryClick = (id) => {
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

    const handleDeleteCategory = () => {
        const id = openDeleteDialog.id;
        setOpenDeleteDialog({
            isOpen: false,
        });
        deleteCategory(id).then((response) => {
            if (response.status === 204) {
                for (let i = 0; i < categories.length; i++) {
                    if (categories[i]._id === id) categories.splice(i, 1);
                }
                setCategories(categories);
                enqueueSnackbar("Category deleted successfully", { variant: SnackBarVariant.Success });
            } else {
                console.log(response.error_message);
                enqueueSnackbar(`Delete failed: ${response.error_message}`, { variant: SnackBarVariant.Error });
            }
        }).catch((err) => {
            enqueueSnackbar("Delete failed", { variant: SnackBarVariant.Error });
        });

    }


    const editUser = (userId) => {

    }

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getAllCategories();
            if (response.status === 200) {
                let data = response.data;
                setCategories(data);
            } else {
                console.log(response);
                enqueueSnackbar("Error, can not get category list", { variant: SnackBarVariant.Error });
            }
        } catch (e) {
            enqueueSnackbar("Error, can not get category list", { variant: SnackBarVariant.Error });
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div>
                <Button style={{ marginBottom: 20 }} variant="contained" color="primary" onClick={() => this.addUser()}>
                    Add category
                </Button>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell style={{ width: '10%' }}>#</StyledTableCell>
                            <StyledTableCell style={{ width: '15%' }}>Type</StyledTableCell>
                            <StyledTableCell style={{ width: '20%' }}>Parent</StyledTableCell>
                            <StyledTableCell style={{ width: '20%' }}>Name</StyledTableCell>
                            <StyledTableCell style={{ width: '25%' }}>Created At</StyledTableCell>
                            <StyledTableCell style={{ width: '5%' }} align="right">Edit</StyledTableCell>
                            <StyledTableCell style={{ width: '5%' }} align="right">Delete</StyledTableCell>
                        </TableRow>

                    </TableHead>


                    <TableBody>
                        {loading ?
                            <StyledTableRow>
                                {/* <CircularProgress /> */}
                            </StyledTableRow>
                            :
                            categories
                                .map((row, index) => (
                                    <StyledTableRow key={row._id}>
                                        <StyledTableCell>{index + 1}</StyledTableCell>
                                        <StyledTableCell >{row.parent?'Sub category':'Category'}</StyledTableCell>
                                        <StyledTableCell >{row.parentName}</StyledTableCell>
                                        <StyledTableCell >{row.name}</StyledTableCell>
                                        <StyledTableCell >{row.createdAt}</StyledTableCell>
                                        <StyledTableCell align="right" style={{ color: 'blue' }} onClick={() => editUser(row._id)}><CreateIcon /></StyledTableCell>
                                        <StyledTableCell align="right" style={{ color: 'red' }} onClick={() => onDeleteCategoryClick(row._id)}><DeleteIcon /></StyledTableCell>

                                    </StyledTableRow>
                                ))}
                    </TableBody>
                </Table>

            </div>

            <ConfirmationDialog
                show={openDeleteDialog.isOpen}
                title='Delete category'
                detail='Are you sure you want to delete this category?'
                cancel={() => { handleCloseDialog() }}
                confirm={() => { handleDeleteCategory() }}
            ></ConfirmationDialog>
        </>

    );
}

