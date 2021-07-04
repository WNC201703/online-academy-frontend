import React, { useEffect, useState } from "react";
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableRow, TableHead } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from "notistack";
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { SnackBarVariant } from "../../../utils/constant";
import { getAllCategories, deleteCategory } from "../../../config/api/Categories";
import ConfirmationDialog from "../../../components/Dialog/ConfirmationDialog";
import AddCategoryDialog from "./AddCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";

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
    const [reload, setReload] = useState(0);
    const [categories, setCategories] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState({
        isOpen: false,
        id: null
    });
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState({
        isOpen: false,
        category: null
    });


    const fetchData = async () => {
        setLoading(false);
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

    useEffect(() => {
        fetchData();
    }, [reload]); // eslint-disable-line react-hooks/exhaustive-deps

    const onDeleteCategoryClick = (id) => {
        setOpenDeleteDialog({
            isOpen: true,
            id: id
        });
    }

    const handleDeleteCategory = () => {
        const id = openDeleteDialog.id;
        setOpenDeleteDialog({
            isOpen: false,
        });
        deleteCategory(id).then((response) => {
            console.log(response.status);
            if (response.status === 204) {
                console.log(categories);
                for (let i = 0; i < categories.length; i++) {
                    if (categories[i]._id === id) categories.splice(i, 1);
                }
                console.log(categories);
                setLoading(true);
                setCategories(categories);
                setLoading(false);
                enqueueSnackbar("Category deleted successfully", { variant: SnackBarVariant.Success });
            } else {
                console.log(response.error_message);
                enqueueSnackbar(`Delete failed: ${response.error_message}`, { variant: SnackBarVariant.Error });
            }
        }).catch((err) => {
            enqueueSnackbar("Delete failed", { variant: SnackBarVariant.Error });
        });

    }

    const onEditCategoryClick = (category) => {
        console.log(category);
        setOpenEditDialog({
            isOpen: true,
            category: category
        });
    }


    return (
        <>
            <div>
                <Button style={{ marginBottom: 20 }} variant="contained" color="primary" onClick={() => { setOpenAddDialog(true) }}>
                    Add category
                </Button>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell style={{ width: '10%' }}>#</StyledTableCell>
                            <StyledTableCell style={{ width: '20%' }}>Name</StyledTableCell>
                            <StyledTableCell style={{ width: '15%' }}>Type</StyledTableCell>
                            <StyledTableCell style={{ width: '20%' }}>Parent</StyledTableCell>
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
                            categories
                                .map((row, index) => (
                                    <StyledTableRow key={row._id} className='tableRow'>
                                        <StyledTableCell >
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell style={!row.parent ? { fontWeight: 'bold' } : {}}  >
                                            <Typography variant={row.parent ? 'normal' : 'h6'} >
                                                {row.parent ? `___${row.name}` : row.name}
                                            </Typography>
                                        </StyledTableCell>
                                        <StyledTableCell >{row.parent ? 'Sub category' : 'Category'}</StyledTableCell>
                                        <StyledTableCell >{row.parentName}</StyledTableCell>
                                        <StyledTableCell >{row.createdAt}</StyledTableCell>
                                        <StyledTableCell align="right" style={{ color: 'blue' }} onClick={() => onEditCategoryClick(row)}><CreateIcon /></StyledTableCell>
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
                cancel={
                    () => { setOpenDeleteDialog({ isOpen: false, id: null }); }
                }
                confirm={handleDeleteCategory}
            ></ConfirmationDialog>

            <AddCategoryDialog
                show={openAddDialog}
                parents={categories.map(item => !item.parent ? item : {})}
                cancel={
                    () => { setOpenAddDialog(false) }
                }
                success={
                    () => {
                        enqueueSnackbar("Category was added successfully", { variant: SnackBarVariant.Success });
                        setReload(reload + 1);
                    }
                }

                fail={
                    () => { enqueueSnackbar("Failed to create new category", { variant: SnackBarVariant.Error }); }
                }
            ></AddCategoryDialog>

            <EditCategoryDialog
                show={openEditDialog.isOpen}
                category={openEditDialog.category}
                cancel={
                    () => { setOpenEditDialog(false) }
                }
                parents={categories.map(item => !item.parent ? item : {})}

                success={
                    () => {
                        enqueueSnackbar("Category was updated successfully", { variant: SnackBarVariant.Success });
                        setReload(reload + 1);
                    }
                }
                fail={
                    () => { enqueueSnackbar("Failed to update category", { variant: SnackBarVariant.Error }); }
                }
            ></EditCategoryDialog>
        </>

    );
}

