import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { createTeacher } from "../../../config/api/User";
import InputAdornment from '@material-ui/core/InputAdornment';
import EmailIcon from '@material-ui/icons/Email';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import { isValidEmail } from "../../../utils/ValidationHelper";

export default function AddTeacherDialog({ show, cancel, success, fail }) {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailFieldError, setEmailFieldError] = useState(false);
    const [fullNameFieldError, setFullNameFieldError] = useState(false);
    const [passwordFieldError, setPasswordFieldError] = useState(false);
    const [confirmPasswordFieldError, setConfirmPasswordFieldError] = useState(false);

    const handleEmailInputChange = event => {
        setEmail(event.target.value);
    };

    const handleFullNameInputChange = event => {
        setFullName(event.target.value);
    };

    const handlePasswordInputChange = event => {
        setPassword(event.target.value);
    };


    const handleConfirmPasswordInputChange = event => {
        setConfirmPassword(event.target.value);
    };

    const clearFieldsValue = () => {
        setEmail('');
        setFullName('');
        setPassword('');
        setConfirmPassword('');
    }

    const handleAddNewTeacher = async () => {
        setEmailFieldError(false);
        setFullNameFieldError(false);
        setPasswordFieldError(false);
        setConfirmPasswordFieldError(false);

        if (fullName.length === 0) {
            setFullNameFieldError(true);
            return;
        }
        if (!isValidEmail(email)) {
            setEmailFieldError(true);
            return;
        }

        if (password.length < 6) {
            setPasswordFieldError(true);
            return;
        }

        if (confirmPassword !== password) {
            setPasswordFieldError(true);
            setConfirmPasswordFieldError(true);
            return;
        }

        try {
            const response = await createTeacher({
                fullname: fullName,
                email: email,
                password: password
            });
            if (response.status === 201) {
                clearFieldsValue();
                success();
                cancel();
            }
            else {
                if (response.data?.error_message) {
                    fail(response.data?.error_message);
                } else {
                    fail();
                }
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
                open={show}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle id="max-width-dialog-title">Add new teacher</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <TextField variant="outlined" autoComplete="off"
                            autoFocus
                            value={fullName}
                            onChange={handleFullNameInputChange}
                            error={fullNameFieldError}
                            margin="dense"
                            label="Full name"
                            type="text"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </DialogContentText>

                    <DialogContentText autoComplete="off">
                        <TextField variant="outlined"
                            autoFocus
                            value={email}
                            onChange={handleEmailInputChange}
                            error={emailFieldError}
                            margin="dense"
                            label="Email"
                            type="text"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </DialogContentText>



                    <DialogContentText>
                        <TextField variant="outlined" autoComplete="off"
                            autoFocus
                            value={password}
                            onChange={handlePasswordInputChange}
                            error={passwordFieldError}
                            margin="dense"
                            label="Password"
                            type="password"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </DialogContentText>

                    <DialogContentText>
                        <TextField variant="outlined" autoComplete="off"
                            autoFocus
                            value={confirmPassword}
                            onChange={handleConfirmPasswordInputChange}
                            error={confirmPasswordFieldError}
                            helperText="Confirm password does not match."
                            margin="dense"
                            label="Confirm password"
                            type="password"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </DialogContentText>

                </DialogContent>
                <DialogActions>
                    <Button onClick={cancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddNewTeacher} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
