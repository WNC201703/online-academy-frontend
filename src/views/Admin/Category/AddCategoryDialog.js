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
    const [textFieldError, setTextFieldError] = useState(false);

    const handleTextInputChange = event => {
        setCategoryName(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setParentCategory(event.target.value);
    };

    const handleAddNewCategory = async () => {
        if (!categoryName) {
            setTextFieldError(true);
            return
        }
        try {
            const response = await createCategory({
                name: categoryName,
                parent: parentCategory
            });
            if (response.status === 201) {
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
                    <form className={classes.form} noValidate>
                        <FormControl style={{ minWidth: 910 }} variant="outlined" className={classes.formControl}>
                            <TextField
                                select
                                value={parentCategory}
                                onChange={handleCategoryChange}
                                label="Parent"
                                fullWidth
                            >
                                <MenuItem key='none' value={null}>
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
