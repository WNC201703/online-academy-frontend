import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { updateCategory } from "../../config/api/Categories";

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

export default function EditCategoryDialog({ show,parents, category, cancel, success, fail }) {
    const classes = useStyles();
    const [parentCategory, setParentCategory] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [textFieldError, setTextFieldError] = useState(false);

    useEffect(() => {
        setCategoryName(category? category.name : '');
        setParentCategory(category? category.parent : '');
    }, [category])

    const handleTextInputChange = event => {
        setCategoryName(event.target.value);
    };

    const handleCategoryChange = (event) => {
        console.log(event.target.value);
        setParentCategory(event.target.value);
    };

    const handleEditCategory = async () => {
        if (!categoryName) {
            setTextFieldError(true);
            return
        }
        try {
            console.log(category._id);
            const response = await updateCategory(category._id,{
                name: categoryName,
                parent: parentCategory.length===0 ? null:parentCategory
            });
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

    const newArr=[];
    parents.forEach(element => {
        if (element._id){
            newArr.push(element);
        }
    });
    parents=newArr;
    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth='md'
                open={show}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle id="max-width-dialog-title">Edit category: {category?category.name:''}</DialogTitle>
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
                                <MenuItem key='none' value=''>
                                    <em>None</em>
                                </MenuItem>
                                {parents ?
                                    parents.map(item => (
                                        <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                                    )) :
                                    (<></>)
                                }
                            </TextField>
                        </FormControl>
                    </form>
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
