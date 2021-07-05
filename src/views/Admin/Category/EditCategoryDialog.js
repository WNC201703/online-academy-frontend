import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { updateCategory } from "../../../config/api/Categories";

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: 120,
    },
    formControlLabel: {
        marginTop: theme.spacing(1),
    },
}));

export default function EditCategoryDialog({ show, parents, category, cancel, success, fail }) {
    const classes = useStyles();
    const [parentCategory, setParentCategory] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [textFieldError, setTextFieldError] = useState(false);
    const [subCategory, setSubCategory] = useState(false);
    const [parentCategoryFieldError, setParentCategoryFieldError] = useState(false);

    if (show) {
        let newArr = [];
        parents.forEach(element => {
            if (element._id) {
                if (category) {
                    if (category._id !== element._id) newArr.push(element);
                } else {
                    newArr.push(element);
                }
            }
        });
        parents = newArr;
    }

    useEffect(() => {
        setSubCategory(category ? (category.parent ? true : false) : false)
        setCategoryName(category ? category.name : '');
        setParentCategory(category ? category.parent : '');
    }, [category])

    const handleTextInputChange = event => {
        setCategoryName(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setParentCategory(event.target.value);
    };

    const handleCategoryTypeChange = (event) => {
        setSubCategory(event.target.value);
    };


    const handleEditCategory = async () => {
        if (!categoryName) {
            setTextFieldError(true);
            return
        }

        if (subCategory && !parentCategory) {
            setParentCategoryFieldError(true);
            return;
        }

        try {
            const body = {
                name: categoryName,
            }
            if (subCategory) body['parent'] = parentCategory ? parentCategory : null;
            const response = await updateCategory(category._id, body);
            if (response.status === 200) {
                success();
                cancel();
            }
            else {
                fail();
                cancel();
            }
        }
        catch (err) {
            fail();
            cancel();
        }

    }

    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth='md'
                open={show ? show : false}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle id="max-width-dialog-title">Edit category: {category ? category.name : ''}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <TextField variant="outlined" autoComplete="off"
                            autoFocus
                            value={categoryName}
                            onChange={handleTextInputChange}
                            error={textFieldError}
                            margin="dense"
                            label="Category name"
                            type="text"
                            fullWidth
                        />
                    </DialogContentText>

                    <FormControl style={{ minWidth: 910 }} variant="outlined" className={classes.formControl}>
                        <TextField
                            select
                            value={subCategory}
                            onChange={handleCategoryTypeChange}
                            label="Type"
                            fullWidth
                        >
                            <MenuItem key='category' value={false}>
                                <Typography variant="h6" component="h6">Category</Typography>
                            </MenuItem>
                            <MenuItem key='subCategory' value={true}>
                                <Typography variant="h6" component="h6">Sub category</Typography>
                            </MenuItem>
                        </TextField>
                    </FormControl>
                    {subCategory ? <div>
                        <form className={classes.form} noValidate>
                            <FormControl style={{ minWidth: 910 }} variant="outlined" className={classes.formControl}>
                                <TextField
                                    select
                                    value={parentCategory}
                                    error={parentCategoryFieldError}
                                    onChange={handleCategoryChange}
                                    label="Parent"
                                    fullWidth
                                >
                                       <MenuItem value=''>
                                        <Typography variant="h6" component="h6">None</Typography>
                                    </MenuItem>
                                    {parents ?
                                        parents.map(item => (
                                            <MenuItem key={item._id} value={item._id}> <Typography variant="h6" component="h6">{item.name}</Typography></MenuItem>
                                        )) :
                                        (<Typography component={'span'} variant={'body2'}>
                                        </Typography>)
                                    }
                                </TextField>
                            </FormControl>
                        </form>
                    </div> : <div></div>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditCategory} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
