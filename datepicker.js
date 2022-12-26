import { createOptionElements } from "./util.js";

class DatePicker {
  constructor(obj) {
    this.uid = obj.id;
    this.startDate = obj.startDate;
    this.endDate = obj.endDate;
    this.defaultYearAndMonth = obj.defaultYearAndMonth;
    this.currentYearAndMonth = obj.defaultYearAndMonth;

    this.inputElement = document.getElementById(this.uid);
    this.datepickerDiv = null;
  }

  addHTML() {
    const html = `
    <div class="datepicker u-div-show" id="datepicker-${this.uid}">
    <div class="datepicker-calendar">
      <div class="datepicker-calendar--header">
        <div class="datepicker-calendar--header__dates">
          <span
            class="datepicker-calendar--header__dates year-and-month"
          >      
            <span class="pick-month"></span>
            <select class="pick-month-select" disabled>
            </select>
            <span class="pick-year"></span>
            <select class="pick-year-select">
            </select>
          </span>
          <button class="month-change go-to-previous-month"><</button>

          <button class="month-change go-to-next-month">></button>
        </div>
        <div class="datepicker-calendar--header__dates-row">
          <div class="day-unit">S</div>
          <div class="day-unit">M</div>
          <div class="day-unit">T</div>
          <div class="day-unit">W</div>
          <div class="day-unit">T</div>
          <div class="day-unit">F</div>
          <div class="day-unit">S</div>
        </div>
      </div>
      <div class="datepicker-calendar--body">
      </div>
    </div>
  </div>
    `;

    // console.log(this.uid);
    //go to form group
    this.inputElement.parentElement.insertAdjacentHTML("beforeend", html);
    this.datepickerDiv = document.getElementById(`datepicker-${this.uid}`);

    this.setHeaderYearAndMonthRange();
    this.setUpEventListeners();
  }

  //add event listeners to dropdown year and month
  // set value when change year
  setUpEventListeners() {
    document
      .querySelector(`#datepicker-${this.uid} .pick-year-select`)
      .addEventListener("change", () => {
        this.currentYearAndMonth =
          event.target.value + this.currentYearAndMonth.substring(7, 4);
        this.setHeaderYearAndMonthRange();
      });

    // set value when change month
    document
      .querySelector(`#datepicker-${this.uid} .pick-month-select`)
      .addEventListener("change", () => {
        this.currentYearAndMonth =
          this.currentYearAndMonth.substring(0, 5) + event.target.value;
        this.setHeaderYearAndMonthRange();
      });

    //next month
    document
      .querySelector(`#datepicker-${this.uid} .go-to-next-month`)
      .addEventListener("click", (event) => {
        event.preventDefault();
        this.changeMonth(1);
      });

    //next month
    document
      .querySelector(`#datepicker-${this.uid} .go-to-previous-month`)
      .addEventListener("click", (event) => {
        event.preventDefault();
        this.changeMonth(-1);
      });

    //change date from input field
    document.getElementById(this.uid).addEventListener("keyup", (e) => {
      // this.currentYearAndMonth = moment(
      //   document.getElementById(this.uid).value
      // ).format("MM/DD/YYYY");
      if (e.key === "Enter" || e.keyCode === 13) {
        console.log("currentYearAndMonth" + this.currentYearAndMonth);
        console.log("selectedDate" + this.selectedDate);
        console.log(".inputElement.value" + this.inputElement.value);
        this.currentYearAndMonth = moment(
          document.getElementById(this.uid).value
        ).format("YYYY-MM");
        this.selectedDate = moment(
          document.getElementById(this.uid).value
        ).format("MM/DD/YYYY");

        console.log(this.currentYearAndMonth.substring(7, 5));
        this.setHeaderYearAndMonthRange();
      }
    });
  }

  //set first init value of year and month
  setHeaderYearAndMonthRange() {
    //reset pop up
    document.querySelector(
      `#datepicker-${this.uid} .pick-year-select`
    ).innerHTML = "";
    document.querySelector(
      `#datepicker-${this.uid} .pick-month-select`
    ).innerHTML = "";
    const startYear = +this.startDate.substring(0, 4);
    const endYear = +this.endDate.substring(0, 4);
    const currentYear = +this.currentYearAndMonth.substring(0, 4);
    for (let i = startYear; i <= endYear; i++) {
      createOptionElements(i, i, `#datepicker-${this.uid} .pick-year-select`);
    }

    let iterationDate = moment(new Date(this.startDate));
    let iterationDateYYYYMM = iterationDate.format("YYYY-MM");

    const endDate = moment(new Date(this.endDate));
    const endDateYYYYMM = endDate.format("YYYY-MM");

    while (iterationDateYYYYMM <= endDateYYYYMM) {
      if (+iterationDate.format("YYYY") === currentYear) {
        createOptionElements(
          iterationDate.format("MM"),
          iterationDate.format("MMMM"),
          `#datepicker-${this.uid} .pick-month-select`
        );
      }
      iterationDate = iterationDate.add(1, "months");
      iterationDateYYYYMM = iterationDate.format("YYYY-MM");
    }

    //limit the datepicker range
    if (this.startDate.substring(0, 7) > this.currentYearAndMonth) {
      this.currentYearAndMonth = this.startDate.substring(0, 7);
    } else if (this.endDate.substring(0, 7) < this.currentYearAndMonth) {
      this.currentYearAndMonth = this.endDate.substring(0, 7);
    }

    // console.log(currentYear);
    //set value
    document.querySelector(`#datepicker-${this.uid} .pick-year-select`).value =
      currentYear;
    document.querySelector(`#datepicker-${this.uid} .pick-month-select`).value =
      this.currentYearAndMonth.substring(7, 5);

    this.renderDays();
  }

  //render days
  renderDays() {
    //reset pop up
    document.querySelector(
      `#datepicker-${this.uid} .datepicker-calendar--body`
    ).innerHTML = "";

    const monthArray = [];
    const firstDayOfMonth = this.firstWeekDayOfTheMonth();

    for (let i = 1; i < firstDayOfMonth; i++) {
      monthArray.push("");
    }

    const daysInMonth = this.daysInCurrentMonth();

    for (let i = 1; i <= daysInMonth; i++) {
      monthArray.push(i);
    }

    if (monthArray.length % 7 !== 0) {
      const fillEmptySlots = 7 - (monthArray.length % 7);
      for (let i = 1; i <= fillEmptySlots; i++) {
        monthArray.push("");
      }
    }
    monthArray.forEach((day, index) => {
      if (index % 7 === 0) {
        const newRow =
          '<div class="datepicker-calendar--body__dates-row"></div>';
        document
          .querySelector(`#datepicker-${this.uid} .datepicker-calendar--body`)
          .insertAdjacentHTML("beforeend", newRow);
      }

      const calendarRows = document.querySelectorAll(
        `#datepicker-${this.uid} .datepicker-calendar--body__dates-row`
      );

      const calendarRowsCount = calendarRows.length;

      let entry = day;

      const dateValue = `${this.currentYearAndMonth}-${
        day < 10 ? "0" + day : day
      }`;

      if (
        this.startDate <= dateValue &&
        this.endDate >= dateValue &&
        !(dateValue.substr(8, 2).length === 1 && dateValue.substr(8, 2) === "0")
      ) {
        entry = `<a href="javascript:void(0)" data-value="${moment(
          dateValue
        ).format("MM/DD/YYYY")}">${day}</a>`;
      }
      const newDay = `<div class="day-unit">${entry}</div>`;
      calendarRows[calendarRowsCount - 1].insertAdjacentHTML(
        "beforeend",
        newDay
      );
    });
    const monthDayLinks = document.querySelectorAll(
      `#datepicker-${this.uid} .day-unit a`
    );

    for (const dayLink of monthDayLinks) {
      dayLink.addEventListener("click", (event) => {
        event.preventDefault();
        const date = event.target.getAttribute("data-value");
        this.selectedDate = this.inputElement.value =
          moment(date).format("MM/DD/YYYY");

        this.highlightSelectedDay();

        this.emitDateSelected();

        setTimeout(() => {
          this.datepickerDiv.classList.remove("u-div-show");
        }, 150);
      });
    }
    //highlight selected day when popup
    // console.log(this.inputElement.value);
    // if (this.inputElement.value != null) {
    //   this.currentYearAndMonth = moment(this.inputElement.value).format(
    //     "YYYY-MM"
    //   );
    // }
    if (
      this.currentYearAndMonth === moment(this.selectedDate).format("YYYY-MM")
    ) {
      const checkedDate = document.querySelector(
        `#datepicker-${this.uid} .day-unit a[data-value='${moment().format(
          "MM/DD/YYYY"
        )}']`
      );
      if (checkedDate != null) {
        checkedDate.classList.add("selected-day");
      }
      this.inputElement.value = moment(this.selectedDate).format("MM/DD/YYYY");
    }

    if (this.selectedDate) this.highlightSelectedDay();
  }

  highlightSelectedDay() {
    const currentHighlight = document.querySelector(
      `#datepicker-${this.uid} .selected-day`
    );

    if (currentHighlight) currentHighlight.classList.remove("selected-day");

    if (
      moment(this.selectedDate).format("YYYY-MM") === this.currentYearAndMonth
    )
      document
        .querySelector(
          `#datepicker-${this.uid} .day-unit a[data-value='${moment(
            this.selectedDate
          ).format("MM/DD/YYYY")}']`
        )
        .classList.add("selected-day");
  }

  emitDateSelected() {
    const dateSelected = new CustomEvent("date-selected", {
      detail: moment(this.selectedDate).format("MM/DD/YYYY"),
    });
    this.inputElement.dispatchEvent(dateSelected);
  }

  changeMonth(value) {
    const newDate = moment(new Date(this.currentYearAndMonth))
      .add(value, "months")
      .format("YYYY-MM");
    if (
      this.startDate.substring(0, 7) <= newDate &&
      this.endDate.substring(0, 7) >= newDate
    ) {
      this.currentYearAndMonth = newDate;
      this.setHeaderYearAndMonthRange();
      this.renderDays();
    }
  }

  firstWeekDayOfTheMonth() {
    let firstDaytmp = moment(new Date(this.currentYearAndMonth)).isoWeekday();
    if (firstDaytmp === 7) {
      return 0;
    } else {
      return firstDaytmp + 1;
    }
  }

  daysInCurrentMonth() {
    return moment(new Date(this.currentYearAndMonth)).daysInMonth();
  }
}

export default DatePicker;
