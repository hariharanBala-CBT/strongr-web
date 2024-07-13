import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Clock, CheckCircle, XCircle, CheckSquare, Eye } from "react-feather";
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
    <div className="user-profile-screen user-profile-wrapper">
      <Header location="nav-all" />
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round"></span>
        <div className="container">
          <h1 className="text-white">User Profile</h1>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>User Profile</li>
          </ul>
        </div>
      </section>
      <div className="content court-bg">
        <div className="container">
          <div className="user-profile-list profile-profile-list">
            <ul className="nav">
              <li>
                <a className="active">Profile</a>
              </li>
              <li>
                <a
                  onClick={() => {
                    navigate(`/profile/${userInfo.id}`);
                  }}
                >
                  Update Profile
                </a>
              </li>
              <li>
                <LinkContainer to="/updatepassword">
                  <a>Update Password</a>
                </LinkContainer>
              </li>
            </ul>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="profile-detail-group">
                <div className="card">
                  <h2>My Profile</h2>
                  <form>
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="input-space">
                          <label className="form-label">User Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={userInfo?.username}
                            id="name"
                            placeholder="Enter Name"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="input-space">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={userInfo?.first_name}
                            id="name"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="input-space">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            value={userInfo?.email}
                            className="form-control"
                            id="email"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="input-space">
                          <label className="form-label">Phone Number</label>
                          <input
                            type="text"
                            value={userInfo?.customer?.phone_number}
                            className="form-control"
                            id="phone"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="info-about"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <Grid item xs={8} className="booked-table-content">
                <Item>
                  <h2>My Bookings</h2>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead className="table-heading">
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
                              new Date(b.booking_date) -
                              new Date(a.booking_date)
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
                                <TableCell>
                                  {booking.organization_name}
                                </TableCell>
                                <TableCell>{booking.game_type}</TableCell>
                                <TableCell>{formattedDate}</TableCell>
                                <TableCell>₹ {booking.total_price}</TableCell>
                                <TableCell>
                                  <span
                                    className={
                                      booking.booking_status === 1
                                        ? "badge bg-info pending-status"
                                        : booking.booking_status === 2
                                        ? "badge bg-success booked-status"
                                        : booking.booking_status === 3
                                        ? "badge bg-danger cancelled-status"
                                        : booking.booking_status === 4 &&
                                          "badge bg-completed"
                                    }
                                  >
                                    <p className="booking-icons">
                                      {booking.booking_status === 1 && (
                                        <Clock size={18} />
                                      )}
                                      {booking.booking_status === 2 && (
                                        <CheckCircle size={18} />
                                      )}
                                      {booking.booking_status === 3 && (
                                        <XCircle size={18} />
                                      )}
                                      {booking.booking_status === 4 && (
                                        <CheckSquare size={18} />
                                      )}
                                      {getBookingStatusText(
                                        booking.booking_status
                                      )}
                                    </p>
                                  </span>
                                </TableCell>
                                <TableCell className="text-pink">
                                  <a
                                    onClick={() => redirectBooking(booking.id)}
                                  >
                                    <Eye
                                      size={18}
                                      color="#1859e5"
                                      className="eye-icon"
                                    />
                                    Details
                                  </a>
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
                                        <i className="fas fa-rectangle-xmark"></i>
                                      </IconButton>
                                    ) : booking?.booking_status === 4 ? (
                                      <IconButton color="success">
                                        <i className="fas fa-square-check"></i>
                                      </IconButton>
                                    ) : booking?.booking_status === 3 ? (
                                      <IconButton color="default">
                                        <i className="fas fa-rectangle-xmark"></i>
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
                                        <i className="fas fa-rectangle-xmark"></i>
                                      </IconButton>
                                    ) : (
                                      <IconButton color="info">
                                        <i className="fas fa-rectangle-xmark"></i>
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
                    className="pagination-para-text"
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
            </div>
          </div>
        </div>
      </div>
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
