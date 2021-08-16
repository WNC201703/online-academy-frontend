import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { createCategory } from "../../../config/api/Categories";

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

export default function AddCategoryDialog({ show, parents, cancel, success, fail }) {
    const classes = useStyles();
    const [parentCategory, setParentCategory] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [subCategory, setSubCategory] = useState(false);
    const [textFieldError, setTextFieldError] = useState(false);
    const [parentCategoryFieldError, setParentCategoryFieldError] = useState(false);

    const handleTextInputChange = event => {
        setCategoryName(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setParentCategory(event.target.value);
    };

    const handleCategoryTypeChange = (event) => {
        setSubCategory(event.target.value);
    };

    const clearFieldsValue = () => {
        setCategoryName('');
        setParentCategory('');
        setSubCategory(false);
    }

    const handleAddNewCategory = async () => {
        if (!categoryName) {
            setTextFieldError(true);
            return;
        }
        if (subCategory && !parentCategory) {
            setParentCategoryFieldError(true);
            return;
        }
        try {
            const body = {
                name: categoryName,
            }
            body['parent'] = parentCategory ? parentCategory : null;
            const response = await createCategory(body);
            console.log(body);
            if (response.status === 201) {
                clearFieldsValue();
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

    const newArr = [];
    parents.forEach(element => {
        if (element._id) {
            newArr.push(element);
        }
    });
    parents = newArr;
    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth='md'
                open={show}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle id="max-width-dialog-title">Add new category</DialogTitle>
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
                                        ))
                                    :
                                    <div></div>
                                }
                            </TextField>
                        </FormControl>
                    </div> : <div></div>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddNewCategory} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
