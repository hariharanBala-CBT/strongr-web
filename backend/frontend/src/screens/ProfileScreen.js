import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isAfter } from "date-fns";

import Footer from "../components/Footer";
import Header from "../components/Header";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Tooltip,
  IconButton,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Grid,
} from "@mui/material";

import { bookingCancel, listUserBookings } from "../actions/actions";

import { USER_UPDATE_PROFILE_RESET } from "../constants/constants";

import "../css/profilescreen.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  const today = new Date();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [bookingId, setBookingId] = useState("");

  const { userInfo } = useSelector((state) => state.userLogin);
  const { userbookings } = useSelector((state) => state.userBookingsList);
  const { cancelBooking } = useSelector((state) => state.cancelBooking);

  function getBookingStatusText(status) {
    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "Booked";
      case 3:
        return "Cancelled";
      case 4:
        return "Completed";
      default:
        return "Unknown";
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
    navigate(`/booking/${value}`);
  };

  useEffect(() => {
    dispatch({
      type: USER_UPDATE_PROFILE_RESET,
    });

    if (userInfo) {
      dispatch(listUserBookings(userInfo.id));
    } else {
      navigate("/");
    }
  }, [navigate, userInfo, dispatch, cancelBooking]);

  const [open, setOpen] = React.useState(false);

  const handleCancelClose = () => {
    setOpen(false);
  };

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
                    <strong>Username: </strong>
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
                    {userInfo?.customer?.phone_number}
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

          {userbookings?.length === 0 ? (
            <Grid item xs={8}>
              <Item sx={{ height: "100%" }}>
                <h2>My Bookings</h2>
                <h3 className="no-bookings">No bookings yet..</h3>
              </Item>
            </Grid>
          ) : (
            <Grid item xs={8}>
              <Item sx={{ height: "76vh" }}>
                <h2>My Bookings</h2>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <h4>Club</h4>
                        </TableCell>
                        <TableCell>
                          <h4>Game</h4>
                        </TableCell>
                        <TableCell>
                          <h4>Booked Date</h4>
                        </TableCell>
                        <TableCell>
                          <h4>Price</h4>
                        </TableCell>
                        <TableCell>
                          <h4>Booking status</h4>
                        </TableCell>
                        <TableCell>
                          <h4>Details</h4>
                        </TableCell>
                        <TableCell>
                          <h4>Action</h4>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userbookings
                        ?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .sort(
                          (a, b) =>
                            new Date(b.booking_date) - new Date(a.booking_date)
                        )
                        .map((booking) => {
                          const bookingDate = new Date(booking.booking_date);
                          const day = String(bookingDate.getDate()).padStart(
                            2,
                            "0"
                          );
                          const month = String(
                            bookingDate.getMonth() + 1
                          ).padStart(2, "0");
                          const year = bookingDate.getFullYear();
                          const formattedDate = `${day}-${month}-${year}`;

                          return (
                            <TableRow key={booking.id}>
                              <TableCell>{booking.organization_name}</TableCell>
                              <TableCell>{booking.game_type}</TableCell>
                              <TableCell>{formattedDate}</TableCell>
                              <TableCell>₹ {booking.total_price}</TableCell>
                              <TableCell>
                                <span
                                  className={
                                    booking.booking_status === 1
                                      ? "pending-status"
                                      : booking.booking_status === 2
                                      ? "booked-status"
                                      : booking.booking_status === 3
                                      ? "cancelled-status"
                                      : booking.booking_status === 4 &&
                                        "completed-status"
                                  }
                                >
                                  {getBookingStatusText(booking.booking_status)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Button
                                  onClick={() => redirectBooking(booking.id)}
                                >
                                  Details
                                </Button>
                              </TableCell>
                              <TableCell>
                                <Tooltip
                                  title={
                                    booking?.booking_status === 1
                                      ? "Pending bookings can't be cancelled"
                                      : booking?.booking_status === 4
                                      ? "Booking completed"
                                      : booking?.booking_status === 3
                                      ? "Cancelled"
                                      : booking?.booking_status === 2 &&
                                        isAfter(
                                          new Date(booking.booking_date),
                                          today
                                        )
                                      ? "Cancel Booking"
                                      : booking?.booking_status === 2 &&
                                        !isAfter(
                                          new Date(booking.booking_date),
                                          today
                                        )
                                      ? "Cancellation is only allowed before one day"
                                      : "Unknown action"
                                  }
                                >
                                  {booking?.booking_status === 1 ? (
                                    <IconButton color="default">
                                      <i class="fas fa-rectangle-xmark"></i>
                                    </IconButton>
                                  ) : booking?.booking_status === 4 ? (
                                    <IconButton color="success">
                                      <i class="fas fa-square-check"></i>
                                    </IconButton>
                                  ) : booking?.booking_status === 3 ? (
                                    <IconButton color="default">
                                      <i class="fas fa-rectangle-xmark"></i>
                                    </IconButton>
                                  ) : booking?.booking_status === 2 &&
                                    isAfter(
                                      new Date(booking.booking_date),
                                      today
                                    ) ? (
                                    <IconButton
                                      color="error"
                                      onClick={() => {
                                        setBookingId(booking.id);
                                        setOpen(true);
                                      }}
                                    >
                                      <i class="fas fa-rectangle-xmark"></i>
                                    </IconButton>
                                  ) : (
                                    <IconButton color="info">
                                      <i class="fas fa-rectangle-xmark"></i>
                                    </IconButton>
                                  )}
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          );
                        })}
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
          )}
        </Grid>
      </Box>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCancelClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Cancel Booking?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            No Refund against this cancellation.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose}>no</Button>
          <Button
            onClick={() => {
              dispatch(bookingCancel(bookingId));
              setOpen(false);
              dispatch(listUserBookings(userInfo.id));
            }}
          >
            confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </div>
  );
}

export default ProfileScreen;
