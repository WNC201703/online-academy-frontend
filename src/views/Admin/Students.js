import React, {useEffect, useState} from "react";
// import ApiService from "../../service/ApiService";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import { SnackBarVariant } from "../../utils/constant";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getAllUser } from "../../config/api/User";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSnackbar} from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
    marginTop: 24,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));


export default function ListStudentComponent() {
  const classes = useStyles();
  const {enqueueSnackbar} = useSnackbar();
  const [isPending, setIsPending] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const eff = async () => {
      await getUsers();
    }
    eff();
  }, []);


  const getUsers = async () => {
    setIsPending(true);
    try {
      const students = await getAllUser();
      setStudents(students.data);
    } catch (e) {
      enqueueSnackbar("Error, can not get student list", { variant: SnackBarVariant.Error });
      console.log(e);
    } finally {
      setIsPending(false);
    }

  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => this.addUser()}>
        Add User
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell align="right">Full name</TableCell>
            <TableCell align="right">Date Registered</TableCell>
            <TableCell align="right">Courses</TableCell>
          </TableRow>
        </TableHead>
       { 
       isPending ?
        <div className={classes.root}><CircularProgress /></div> :
        <TableBody>
          {students.map(row => (
            <TableRow key={row._id}>
              <TableCell component="th" scope="row">
                {row.email}
              </TableCell>
              <TableCell align="right">{row.fullname}</TableCell>
              <TableCell align="right">{row.createdAt}</TableCell>
              <TableCell align="right" onClick={() => this.editUser(row.id)}><CreateIcon /></TableCell>
              <TableCell align="right" onClick={() => this.deleteUser(row.id)}><DeleteIcon /></TableCell>

            </TableRow>
          ))}
        </TableBody>
        }
      </Table>

    </div>
  );

}

const style = {
  display: 'flex',
  justifyContent: 'center'
}
