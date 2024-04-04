  import React, { useEffect } from "react";
  import Header from "../components/Header";
  import { useDispatch, useSelector } from "react-redux";
  import Grid from "@mui/material/Grid";
  import { styled } from "@mui/material/styles";
  import Paper from "@mui/material/Paper";
  import Stack from "@mui/material/Stack";
  import Button from "@mui/material/Button";
  import Table from "@mui/material/Table";
  import TableBody from "@mui/material/TableBody";
  import TableCell from "@mui/material/TableCell";
  import TableContainer from "@mui/material/TableContainer";
  import TableHead from "@mui/material/TableHead";
  import TablePagination from "@mui/material/TablePagination";
  import TableRow from "@mui/material/TableRow";
  import "../css/profilescreen.css";
  import { useNavigate } from "react-router-dom";
  import { listUserBookings, listcustomerDetails } from "../actions/actions";
  import { Box } from "@mui/material";
  import {USER_UPDATE_PROFILE_RESET } from "../constants/constants";

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
  }));

  const Content = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: "left",
  }));

  function ProfileScreen() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userLogin = useSelector((state) => state.userLogin);
    const { userbookings } = useSelector((state) => state.userBookingsList);
    const { userInfo } = userLogin;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    function getStatusText(status) {
      switch (status) {
        case 1:
          return 'Yet to Begin';
        case 2:
          return 'Initiated';
        case 3:
          return 'In Progress';
        case 4:
          return 'Success';
        case 5:
          return 'Cancelled';
        default:
          return 'Unknown';
      }
    }

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const updateUser = () => {
      navigate(`/profile/${userInfo.id}`);
    };

    const redirectBooking = (value) => {
      // console.log(value);
      navigate(`/booking/${value}`);
    };

    const { customerDetails } = useSelector((state) => state.customerDetails);

    useEffect(() => {
      dispatch({
        type: USER_UPDATE_PROFILE_RESET,
      });
      
      if (userInfo) {
        dispatch(listUserBookings(userInfo.id));
        dispatch(listcustomerDetails(userInfo.id));
      } else {
        navigate("/");
      }
    }, [navigate, userInfo, dispatch]);

    return (
      <div>
        <Header location="nav-all" />

        <Box sx={{ flexGrow: 1, height: "80vh" }} className="user">
          <Grid
            container
            spacing={2}
            sx={{ flexWrap: "wrap", flexShrink: "inherit", height: "60vh" }}
          >
            <Grid item xs={4}>
              <Item sx={{ height: "76vh" }}>
                <h2>My Profile</h2>

                <Stack spacing={4}>
                  <Content className="details">
                    <ul>
                      <strong>username: </strong>
                      {userInfo?.username}
                    </ul>
                    <ul>
                      <strong>Name: </strong>
                      {userInfo?.first_name}
                    </ul>
                    <ul>
                      <strong>Email id: </strong>
                      {userInfo?.email}
                    </ul>
                    <ul>
                      <strong>Phone number: </strong>
                      {customerDetails?.phone_number}
                    </ul>
                  </Content>
                  <Button
                    variant="contained"
                    size="small"
                    className="update-user-btn"
                    onClick={updateUser}
                  >
                    Update
                  </Button>
                </Stack>
              </Item>
            </Grid>

            {/* {!userbookings ||
            !userbookings.booking ||
            userbookings.booking.length === 0 ? (
              <Grid item xs={8}>
                <Item sx={{ height: "100%" }}>
                  <h2>My Bookings</h2>
                  <h4>No bookings yet..</h4>
                </Item>
              </Grid>
            ) : ( */}
              <Grid item xs={8}>
                <Item sx={{ height: "76vh" }}>
                  <h2>My Bookings</h2>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <h4> Booking ID</h4>
                          </TableCell>
                          <TableCell>
                            <h4>Date</h4>
                          </TableCell>
                          <TableCell>
                            <h4>Total Price</h4>
                          </TableCell>
                          <TableCell>
                            <h4>Paid</h4>
                          </TableCell>
                          <TableCell>
                            <h4>Details</h4>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userbookings
                          ?.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell>{booking.id}</TableCell>
                              <TableCell>
                                {booking.created_at?.slice(0, 10)}
                              </TableCell>
                              <TableCell>{booking.total_price}</TableCell>
                              <TableCell>{getStatusText(booking.payment_status)}</TableCell>
                              <TableCell>
                                <Button
                                  onClick={redirectBooking.bind(null, booking.id)}
                                >
                                  Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={userbookings?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />{" "}
                </Item>
              </Grid>
            {/* )} */}
          </Grid>
        </Box>
      </div>
    );
  }

  export default ProfileScreen;
