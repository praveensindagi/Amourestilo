import React, { useState } from "react";

const AmourEstiloDashboard = () => {
  /* =====================================================
     DEMO DATA — NO BACKEND / NO FIREBASE
  ===================================================== */

  const [bookings] = useState([
    {
      id: 1,
      name: "Ananya Sharma",
      email: "ananya@example.com",
      service: "Bridal Makeup",
      date: "12 Sep 2026",
      time: "10:00 AM",
      status: "Confirmed",
    },
    {
      id: 2,
      name: "Priya Rao",
      email: "priya@example.com",
      service: "HD Makeup",
      date: "14 Sep 2026",
      time: "2:00 PM",
      status: "Pending",
    },
    {
      id: 3,
      name: "Meera Kapoor",
      email: "meera@example.com",
      service: "Party & Occasion Makeup",
      date: "16 Sep 2026",
      time: "5:00 PM",
      status: "Confirmed",
    },
    {
      id: 4,
      name: "Kavya Nair",
      email: "kavya@example.com",
      service: "Hair Styling",
      date: "18 Sep 2026",
      time: "11:00 AM",
      status: "Completed",
    },
  ]);

  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (item) => item.status === "Pending"
  ).length;

  const confirmedBookings = bookings.filter(
    (item) => item.status === "Confirmed"
  ).length;

  const completedBookings = bookings.filter(
    (item) => item.status === "Completed"
  ).length;

  /* =====================================================
     CSS — INCLUDED IN SAME FILE
  ===================================================== */

  const styles = `
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: "DM Sans", Arial, sans-serif;
      background: #f5f5f3;
      color: #171717;
    }

    button {
      font-family: inherit;
    }

    .amour-dashboard {
      min-height: 100vh;
      display: flex;
      background: #f5f5f3;
    }

    /* ================================
       SIDEBAR
    ================================= */

    .amour-sidebar {
      width: 260px;
      min-height: 100vh;
      background: #111111;
      color: #ffffff;
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      padding: 30px 20px;
      z-index: 10;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 13px;
      padding: 5px 8px 45px;
    }

    .brand-logo {
      width: 44px;
      height: 44px;
      border: 1px solid #c9a45c;
      color: #c9a45c;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Georgia, serif;
      font-size: 13px;
      letter-spacing: 1px;
    }

    .brand-name {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 18px;
      letter-spacing: 1px;
      font-weight: 400;
      margin: 0;
    }

    .brand-subtitle {
      color: #888;
      font-size: 7px;
      letter-spacing: 1.8px;
      margin-top: 5px;
      display: block;
    }

    .navigation {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .nav-button {
      width: 100%;
      border: none;
      background: transparent;
      color: #8f8f8f;
      padding: 14px;
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      text-align: left;
      font-size: 12px;
      transition: all .25s ease;
    }

    .nav-button:hover {
      color: #ffffff;
    }

    .nav-button.active {
      background: #252525;
      color: #ffffff;
      border-left: 2px solid #c9a45c;
    }

    .nav-icon {
      width: 20px;
      text-align: center;
      color: #c9a45c;
      font-size: 16px;
    }

    .sidebar-bottom {
      margin-top: auto;
      border-top: 1px solid #292929;
      padding: 20px 8px 5px;
    }

    .admin-profile {
      display: flex;
      align-items: center;
      gap: 11px;
    }

    .admin-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #c9a45c;
      color: #111;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
    }

    .admin-name {
      font-size: 11px;
      display: block;
    }

    .admin-role {
      color: #777;
      font-size: 9px;
      display: block;
      margin-top: 3px;
    }

    /* ================================
       MAIN
    ================================= */

    .amour-main {
      width: calc(100% - 260px);
      margin-left: 260px;
      padding: 45px;
    }

    /* ================================
       HEADER
    ================================= */

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
    }

    .eyebrow {
      color: #a17b35;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 2px;
      margin: 0 0 10px;
    }

    .dashboard-title {
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      font-weight: 400;
      font-size: clamp(35px, 4vw, 52px);
      line-height: 1;
    }

    .dashboard-title span {
      color: #a17b35;
      font-style: italic;
    }

    .dashboard-description {
      color: #777;
      font-size: 12px;
      margin-top: 14px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .notification {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #ffffff;
      border: 1px solid #ddd;
      cursor: pointer;
      font-size: 15px;
    }

    .header-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #c9a45c;
      color: #111;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;
      font-weight: 700;
    }

    /* ================================
       STAT CARDS
    ================================= */

    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 22px;
    }

    .stat-card {
      background: #ffffff;
      border: 1px solid #e5e5e2;
      padding: 22px;
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .stat-icon {
      width: 44px;
      height: 44px;
      background: #f5f0e7;
      color: #a17b35;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
    }

    .stat-label {
      display: block;
      color: #777;
      font-size: 9px;
      margin-bottom: 6px;
    }

    .stat-number {
      display: block;
      font-family: Georgia, serif;
      font-size: 27px;
      font-weight: 400;
    }

    .stat-small {
      display: block;
      color: #aaa;
      font-size: 8px;
      margin-top: 3px;
    }

    /* ================================
       PANELS
    ================================= */

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1.7fr 1fr;
      gap: 22px;
    }

    .panel {
      background: #ffffff;
      border: 1px solid #e5e5e2;
      padding: 27px;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 22px;
    }

    .panel-eyebrow {
      color: #a17b35;
      font-size: 8px;
      letter-spacing: 2px;
      font-weight: 700;
      margin: 0 0 8px;
    }

    .panel-title {
      font-family: Georgia, serif;
      font-size: 23px;
      font-weight: 400;
      margin: 0;
    }

    .view-button {
      background: transparent;
      border: none;
      color: #a17b35;
      font-size: 10px;
      cursor: pointer;
    }

    /* ================================
       BOOKINGS
    ================================= */

    .booking {
      display: grid;
      grid-template-columns: 1.5fr 1fr auto;
      align-items: center;
      gap: 15px;
      border-top: 1px solid #eeeeeb;
      padding: 15px 0;
    }

    .customer {
      display: flex;
      align-items: center;
      gap: 11px;
    }

    .customer-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #f0eee8;
      color: #9b7635;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 11px;
      font-weight: 600;
    }

    .customer-name {
      display: block;
      font-size: 11px;
      font-weight: 600;
    }

    .customer-service {
      display: block;
      color: #999;
      font-size: 8px;
      margin-top: 4px;
    }

    .appointment-date strong {
      display: block;
      font-size: 10px;
    }

    .appointment-date span {
      display: block;
      color: #999;
      font-size: 8px;
      margin-top: 4px;
    }

    .status {
      padding: 6px 10px;
      font-size: 7px;
      letter-spacing: .8px;
      text-transform: uppercase;
    }

    .status.confirmed {
      background: #eaf2ec;
      color: #52765a;
    }

    .status.pending {
      background: #f6efe1;
      color: #9b7635;
    }

    .status.completed {
      background: #eeeeee;
      color: #555;
    }

    /* ================================
       QUICK ACTIONS
    ================================= */

    .quick-action {
      width: 100%;
      background: transparent;
      border: none;
      border-top: 1px solid #eeeeeb;
      padding: 15px 0;
      display: grid;
      grid-template-columns: 40px 1fr auto;
      align-items: center;
      gap: 13px;
      text-align: left;
      cursor: pointer;
    }

    .quick-icon {
      width: 38px;
      height: 38px;
      background: #f5f0e7;
      color: #a17b35;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 17px;
    }

    .quick-title {
      display: block;
      font-size: 10px;
      font-weight: 600;
    }

    .quick-description {
      display: block;
      color: #999;
      font-size: 8px;
      margin-top: 4px;
    }

    .quick-arrow {
      color: #aaa;
      font-size: 14px;
    }

    /* ================================
       FOOTER
    ================================= */

    .dashboard-footer {
      display: flex;
      justify-content: space-between;
      color: #999;
      font-size: 8px;
      letter-spacing: 1px;
      padding: 32px 2px 5px;
    }

    /* ================================
       RESPONSIVE
    ================================= */

    @media (max-width: 1100px) {

      .stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
      }

    }

    @media (max-width: 750px) {

      .amour-sidebar {
        width: 70px;
        padding: 20px 9px;
      }

      .brand {
        justify-content: center;
        padding: 5px 0 35px;
      }

      .brand-name,
      .brand-subtitle {
        display: none;
      }

      .nav-button {
        justify-content: center;
        padding: 14px 5px;
      }

      .nav-button span:not(.nav-icon) {
        display: none;
      }

      .nav-icon {
        font-size: 17px;
      }

      .admin-profile {
        justify-content: center;
      }

      .admin-info {
        display: none;
      }

      .amour-main {
        width: calc(100% - 70px);
        margin-left: 70px;
        padding: 28px 18px;
      }

    }

    @media (max-width: 550px) {

      .dashboard-header {
        margin-bottom: 28px;
      }

      .dashboard-title {
        font-size: 34px;
      }

      .dashboard-description {
        font-size: 10px;
      }

      .stats {
        grid-template-columns: 1fr;
      }

      .panel {
        padding: 20px 15px;
      }

      .booking {
        grid-template-columns: 1fr auto;
      }

      .appointment-date {
        display: none;
      }

      .dashboard-footer {
        flex-direction: column;
        gap: 8px;
      }

    }
  `;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      <style>{styles}</style>

      <div className="amour-dashboard">

        {/* ================================================
            SIDEBAR
        ================================================= */}

        <aside className="amour-sidebar">

          <div className="brand">

            <div className="brand-logo">
              AE
            </div>

            <div>
              <h1 className="brand-name">
                Amour Estilo
              </h1>

              <span className="brand-subtitle">
                BEAUTY • LUXURY • STYLE
              </span>
            </div>

          </div>

          <nav className="navigation">

            {[
              ["⌂", "Dashboard"],
              ["◫", "Appointments"],
              ["♢", "Customers"],
              ["✦", "Services"],
              ["◌", "Messages"],
              ["⚙", "Settings"],
            ].map(([icon, label]) => (

              <button
                key={label}
                className={`nav-button ${
                  activeMenu === label ? "active" : ""
                }`}
                onClick={() => setActiveMenu(label)}
              >

                <span className="nav-icon">
                  {icon}
                </span>

                <span>
                  {label}
                </span>

              </button>

            ))}

          </nav>

          <div className="sidebar-bottom">

            <div className="admin-profile">

              <div className="admin-avatar">
                AE
              </div>

              <div className="admin-info">

                <span className="admin-name">
                  Amour Estilo
                </span>

                <span className="admin-role">
                  Administrator
                </span>

              </div>

            </div>

          </div>

        </aside>

        {/* ================================================
            MAIN
        ================================================= */}

        <main className="amour-main">

          {/* HEADER */}

          <header className="dashboard-header">

            <div>

              <p className="eyebrow">
                WELCOME BACK
              </p>

              <h2 className="dashboard-title">
                Your Beauty
                <span> Dashboard</span>
              </h2>

              <p className="dashboard-description">
                Manage appointments, customers and beauty services.
              </p>

            </div>

            <div className="header-right">

              <button className="notification">
                ♧
              </button>

              <div className="header-avatar">
                AE
              </div>

            </div>

          </header>

          {/* STATISTICS */}

          <section className="stats">

            <div className="stat-card">

              <div className="stat-icon">
                ◫
              </div>

              <div>
                <span className="stat-label">
                  TOTAL APPOINTMENTS
                </span>

                <strong className="stat-number">
                  {totalBookings}
                </strong>

                <small className="stat-small">
                  All bookings
                </small>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                ◷
              </div>

              <div>
                <span className="stat-label">
                  PENDING
                </span>

                <strong className="stat-number">
                  {pendingBookings}
                </strong>

                <small className="stat-small">
                  Awaiting confirmation
                </small>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                ✓
              </div>

              <div>
                <span className="stat-label">
                  CONFIRMED
                </span>

                <strong className="stat-number">
                  {confirmedBookings}
                </strong>

                <small className="stat-small">
                  Upcoming
                </small>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                ✦
              </div>

              <div>
                <span className="stat-label">
                  COMPLETED
                </span>

                <strong className="stat-number">
                  {completedBookings}
                </strong>

                <small className="stat-small">
                  Finished services
                </small>
              </div>

            </div>

          </section>

          {/* CONTENT */}

          <section className="dashboard-grid">

            {/* BOOKINGS */}

            <div className="panel">

              <div className="panel-header">

                <div>

                  <p className="panel-eyebrow">
                    APPOINTMENTS
                  </p>

                  <h3 className="panel-title">
                    Recent Bookings
                  </h3>

                </div>

                <button className="view-button">
                  View All →
                </button>

              </div>

              {bookings.map((booking) => (

                <div
                  className="booking"
                  key={booking.id}
                >

                  <div className="customer">

                    <div className="customer-avatar">
                      {booking.name.charAt(0)}
                    </div>

                    <div>

                      <span className="customer-name">
                        {booking.name}
                      </span>

                      <span className="customer-service">
                        {booking.service}
                      </span>

                    </div>

                  </div>

                  <div className="appointment-date">

                    <strong>
                      {booking.date}
                    </strong>

                    <span>
                      {booking.time}
                    </span>

                  </div>

                  <span
                    className={`status ${
                      booking.status.toLowerCase()
                    }`}
                  >
                    {booking.status}
                  </span>

                </div>

              ))}

            </div>

            {/* QUICK ACTIONS */}

            <div className="panel">

              <div className="panel-header">

                <div>

                  <p className="panel-eyebrow">
                    MANAGEMENT
                  </p>

                  <h3 className="panel-title">
                    Quick Actions
                  </h3>

                </div>

              </div>

              <button className="quick-action">

                <div className="quick-icon">
                  +
                </div>

                <div>
                  <span className="quick-title">
                    New Appointment
                  </span>

                  <span className="quick-description">
                    Create a new booking
                  </span>
                </div>

                <span className="quick-arrow">
                  →
                </span>

              </button>

              <button className="quick-action">

                <div className="quick-icon">
                  ♢
                </div>

                <div>
                  <span className="quick-title">
                    Customers
                  </span>

                  <span className="quick-description">
                    View customer list
                  </span>
                </div>

                <span className="quick-arrow">
                  →
                </span>

              </button>

              <button className="quick-action">

                <div className="quick-icon">
                  ✦
                </div>

                <div>
                  <span className="quick-title">
                    Services
                  </span>

                  <span className="quick-description">
                    Manage beauty services
                  </span>
                </div>

                <span className="quick-arrow">
                  →
                </span>

              </button>

              <button className="quick-action">

                <div className="quick-icon">
                  ⚙
                </div>

                <div>
                  <span className="quick-title">
                    Settings
                  </span>

                  <span className="quick-description">
                    Dashboard preferences
                  </span>
                </div>

                <span className="quick-arrow">
                  →
                </span>

              </button>

            </div>

          </section>

          {/* FOOTER */}

          <footer className="dashboard-footer">

            <span>
              © 2026 Amour Estilo
            </span>

            <span>
              BEAUTY • LUXURY • STYLE
            </span>

          </footer>

        </main>

      </div>
    </>
  );
};

export default AmourEstiloDashboard;