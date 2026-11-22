
/* =========================================
   TERRA — ENERGY INTELLIGENCE
   Main JavaScript
========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 01. ELEMENT SELECTORS
    // =====================================

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const currentOutput = $("#currentOutput");
    const gaugePercent = $("#gaugePercent");
    const gaugeCircle = $(".gauge-progress");

    const chart = $("#productionChart");
    const chartLine = $("#chartLine");
    const chartArea = $("#chartArea");
    const chartPoints = $("#chartPoints");
    const chartLabels = $("#chartLabels");

    const chartTooltip = $("#chartTooltip");
    const tooltipValue = $("#tooltipValue");
    const tooltipLabel = $("#tooltipLabel");

    const chartMain = $(".chart-main");

    const refreshButton = $("#refreshButton");
    const currentDate = $("#currentDate");

    const rangeButtons = $$(".range-button");
    const navLinks = $$(".nav-link");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    // =====================================
    // 02. FICTIONAL DASHBOARD DATA
    // =====================================

    const dashboardData = {
        generation: 842,
        dailyGoal: 1100,
        energyPercentage: 76,

        charts: {

            day: {
                labels: [
                    "6 AM", "8 AM", "10 AM", "12 PM",
                    "2 PM", "4 PM", "6 PM", "8 PM"
                ],

                values: [
                    90, 180, 390, 720,
                    842, 790, 510, 260
                ]
            },

            week: {
                labels: [
                    "MON", "TUE", "WED", "THU",
                    "FRI", "SAT", "SUN"
                ],

                values: [
                    410, 520, 610, 750,
                    680, 842, 730
                ]
            },

            month: {
                labels: [
                    "WEEK 1", "WEEK 2", "WEEK 3",
                    "WEEK 4", "WEEK 5"
                ],

                values: [
                    540, 620, 680, 770, 842
                ]
            }
        }
    };


    // =====================================
    // 03. NUMBER ANIMATION
    // =====================================

    function animateNumber(element, target, suffix = "") {

        if (!element) return;

        const start = 0;
        const duration = reducedMotion ? 0 : 1100;

        if (duration === 0) {
            element.textContent =
                Math.round(target).toLocaleString("en-IN") + suffix;
            return;
        }

        const startTime = performance.now();

        function updateNumber(timestamp) {

            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth ease-out animation
            const eased = 1 - Math.pow(1 - progress, 3);

            const currentValue =
                Math.round(start + (target - start) * eased);

            element.textContent =
                currentValue.toLocaleString("en-IN") + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }

        requestAnimationFrame(updateNumber);
    }


    // =====================================
    // 04. ENERGY GAUGE
    // =====================================

    function animateGauge(percentage) {

        if (!gaugeCircle) return;

        const radius = 91;
        const circumference = 2 * Math.PI * radius;

        gaugeCircle.style.strokeDasharray = circumference;

        gaugeCircle.style.strokeDashoffset = circumference;

        if (gaugePercent) {
            gaugePercent.textContent = "0%";
        }

        const updateGauge = () => {

            const offset =
                circumference -
                (percentage / 100) * circumference;

            gaugeCircle.style.strokeDashoffset = offset;
        };

        if (reducedMotion) {
            updateGauge();
        } else {
            requestAnimationFrame(updateGauge);
        }

        animateNumber(gaugePercent, percentage, "%");
    }


    // =====================================
    // 05. CHART PATH GENERATION
    // =====================================

    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

    const chartWidth = 700;
    const chartHeight = 230;

    const chartPaddingX = 18;
    const chartPaddingY = 12;

    const maxChartValue = 1000;


    function createChartPoints(values) {

        const usableWidth =
            chartWidth - chartPaddingX * 2;

        const usableHeight =
            chartHeight - chartPaddingY * 2;

        return values.map((value, index) => {

            const x = chartPaddingX +
                (index / (values.length - 1)) * usableWidth;

            const y = chartHeight -
                chartPaddingY -
                (value / maxChartValue) * usableHeight;

            return {
                x,
                y,
                value
            };
        });
    }


    // Catmull-Rom inspired smooth SVG curve
    function createSmoothPath(points) {

        if (points.length < 2) return "";

        let path =
            `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {

            const previous = points[Math.max(0, i - 1)];
            const current = points[i];
            const next = points[i + 1];
            const after = points[
                Math.min(points.length - 1, i + 2)
            ];

            const controlOneX =
                current.x + (next.x - previous.x) / 6;

            const controlOneY =
                current.y + (next.y - previous.y) / 6;

            const controlTwoX =
                next.x - (after.x - current.x) / 6;

            const controlTwoY =
                next.y - (after.y - current.y) / 6;

            path +=
                ` C ${controlOneX} ${controlOneY}` +
                ` ${controlTwoX} ${controlTwoY}` +
                ` ${next.x} ${next.y}`;
        }

        return path;
    }


    // =====================================
    // 06. CHART TOOLTIP
    // =====================================

    function showChartTooltip(point, label) {

        if (!chartTooltip || !chartMain) return;

        const positionX =
            (point.x / chartWidth) * chartMain.clientWidth;

        const positionY =
            (point.y / chartHeight) * chartMain.clientHeight;

        const tooltipWidth = 125;

        const safeX = Math.max(
            tooltipWidth / 2,
            Math.min(
                chartMain.clientWidth - tooltipWidth / 2,
                positionX
            )
        );

        chartTooltip.style.left = `${safeX}px`;

        chartTooltip.style.top =
            `${Math.max(5, positionY)}px`;

        tooltipValue.textContent =
            `${point.value.toLocaleString("en-IN")} kWh`;

        tooltipLabel.textContent = label;

        chartTooltip.classList.add("visible");
    }


    function hideChartTooltip() {

        if (chartTooltip) {
            chartTooltip.classList.remove("visible");
        }
    }


    // =====================================
    // 07. RENDER INTERACTIVE CHART
    // =====================================

    let currentRange = "day";


    function renderChart(range = currentRange) {

        if (
            !chart ||
            !chartLine ||
            !chartArea ||
            !chartPoints ||
            !chartLabels
        ) {
            console.warn("Chart elements could not be found.");
            return;
        }

        const selectedData = dashboardData.charts[range];

        if (!selectedData) return;

        currentRange = range;

        const { labels, values } = selectedData;

        const points = createChartPoints(values);

        const linePath = createSmoothPath(points);

        const firstPoint = points[0];
        const lastPoint = points[points.length - 1];

        // Create chart line
        chartLine.setAttribute("d", linePath);

        // Create filled area below the line
        const areaPath =
            linePath +
            ` L ${lastPoint.x} ${chartHeight - chartPaddingY}` +
            ` L ${firstPoint.x} ${chartHeight - chartPaddingY}` +
            " Z";

        chartArea.setAttribute("d", areaPath);

        // Animate chart line drawing
        if (!reducedMotion) {

            const pathLength = chartLine.getTotalLength();

            chartLine.style.transition = "none";
            chartLine.style.strokeDasharray = pathLength;
            chartLine.style.strokeDashoffset = pathLength;

            chartArea.style.transition = "none";
            chartArea.style.opacity = "0";

            chartLine.getBoundingClientRect();

            requestAnimationFrame(() => {

                chartLine.style.transition =
                    "stroke-dashoffset 900ms ease";

                chartLine.style.strokeDashoffset = "0";

                chartArea.style.transition =
                    "opacity 900ms ease";

                chartArea.style.opacity = "1";
            });

        } else {

            chartLine.style.strokeDasharray = "none";
            chartLine.style.strokeDashoffset = "0";
            chartArea.style.opacity = "1";
        }


        // Remove old chart points
        chartPoints.replaceChildren();

        // Add interactive SVG circles
        points.forEach((point, index) => {

            const circle =
                document.createElementNS(SVG_NAMESPACE, "circle");

            circle.setAttribute("cx", point.x);
            circle.setAttribute("cy", point.y);
            circle.setAttribute("r", index === values.length - 1 ? "6" : "4.5");

            circle.setAttribute("fill", "#ffffff");
            circle.setAttribute("stroke", "#527C40");
            circle.setAttribute("stroke-width", "3");

            circle.setAttribute("tabindex", "0");
            circle.setAttribute("role", "img");

            circle.setAttribute(
                "aria-label",
                `${labels[index]}: ${point.value} kilowatt hours`
            );

            const label = labels[index];

            circle.addEventListener("mouseenter", () => {
                showChartTooltip(point, label);
            });

            circle.addEventListener("focus", () => {
                showChartTooltip(point, label);
            });

            circle.addEventListener("mouseleave", hideChartTooltip);

            circle.addEventListener("blur", hideChartTooltip);

            circle.addEventListener("click", () => {
                showChartTooltip(point, label);
            });

            chartPoints.appendChild(circle);
        });


        // Update x-axis labels
        chartLabels.replaceChildren();

        labels.forEach(label => {

            const span = document.createElement("span");

            span.textContent = label;

            chartLabels.appendChild(span);
        });

        // Close an old tooltip when the chart changes
        hideChartTooltip();

        // Keep screen-reader description updated
        chart.setAttribute(
            "aria-label",
            `Solar generation chart for ${
                range === "day" ? "24 hours" :
                range === "week" ? "7 days" : "30 days"
            }.`
        );

        // Update selected filter
        rangeButtons.forEach(button => {

            const isActive =
                button.dataset.range === range;

            button.classList.toggle("active", isActive);

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });
    }


    // =====================================
    // 08. CHART FILTER CONTROLS
    // =====================================

    rangeButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedRange = button.dataset.range;

            if (!dashboardData.charts[selectedRange]) return;

            renderChart(selectedRange);
        });
    });


    // =====================================
    // 09. NAVIGATION HIGHLIGHTING
    // =====================================

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navLinks.forEach(navLink => {
                navLink.classList.remove("active");
                navLink.removeAttribute("aria-current");
            });

            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        });
    });


    // =====================================
    // 10. STATION SHORTCUT
    // =====================================

    const viewStations = $("#viewStations");
    const stationSection = $("#stations");

    if (viewStations && stationSection) {

        viewStations.addEventListener("click", () => {

            stationSection.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });

            navLinks.forEach(link => {

                const active =
                    link.getAttribute("href") === "#stations";

                link.classList.toggle("active", active);

                if (active) {
                    link.setAttribute("aria-current", "page");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        });
    }


    // =====================================
    // 11. ANIMATE PROGRESS BARS
    // =====================================

    function animateProgressBars() {

        const bars = $$(
            ".metric-progress span, " +
            ".station-track span, " +
            ".destination-bar span"
        );

        bars.forEach(bar => {

            const targetWidth = bar.style.width;

            if (!targetWidth) return;

            bar.style.transition = "none";
            bar.style.width = "0%";

            bar.getBoundingClientRect();

            requestAnimationFrame(() => {

                bar.style.transition = reducedMotion
                    ? "none"
                    : "width 1000ms cubic-bezier(0.2, 0.7, 0.2, 1)";

                bar.style.width = targetWidth;
            });
        });
    }


    // =====================================
    // 12. DASHBOARD REFRESH
    // =====================================

    function showRefreshMessage() {

        const existingToast = $(".refresh-toast");

        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement("div");

        toast.className = "refresh-toast";
        toast.textContent = "✳ Demo dashboard refreshed";

        toast.setAttribute("role", "status");

        Object.assign(toast.style, {
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: "1000",
            background: "#193d2b",
            color: "#c6e77b",
            padding: "13px 19px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "700",
            boxShadow: "0 8px 25px rgba(20, 50, 30, 0.2)",
            opacity: "0",
            transform: "translateY(8px)",
            transition: "all 250ms ease"
        });

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateY(0)";
        });

        window.setTimeout(() => {

            toast.style.opacity = "0";
            toast.style.transform = "translateY(8px)";

            window.setTimeout(() => toast.remove(), 300);

        }, 2200);
    }


    if (refreshButton) {

        refreshButton.addEventListener("click", () => {

            // Re-run the demo visualizations
            renderChart(currentRange);

            animateProgressBars();

            if (currentOutput) {
                currentOutput.textContent = "0";
            }

            animateNumber(
                currentOutput,
                dashboardData.generation
            );

            animateGauge(
                dashboardData.energyPercentage
            );

            if (!reducedMotion && refreshButton.animate) {

                refreshButton.animate(
                    [
                        { transform: "rotate(0deg)" },
                        { transform: "rotate(360deg)" }
                    ],
                    {
                        duration: 450,
                        easing: "ease-in-out"
                    }
                );
            }

            showRefreshMessage();
        });
    }


    // =====================================
    // 13. DISPLAY CURRENT DATE
    // =====================================

    function updateDate() {

        if (!currentDate) return;

        const today = new Date();

        currentDate.textContent =
            new Intl.DateTimeFormat("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric"
            }).format(today);
    }


    // =====================================
    // 14. INITIALIZE DASHBOARD
    // =====================================

    function initializeDashboard() {

        updateDate();

        // Animate generation counter
        if (currentOutput) {
            currentOutput.textContent = "0";
        }

        animateNumber(
            currentOutput,
            dashboardData.generation
        );

        // Animate circular gauge
        animateGauge(
            dashboardData.energyPercentage
        );

        // Draw initial 24-hour chart
        renderChart("day");

        // Animate progress indicators
        animateProgressBars();

        // Set initial filter accessibility states
        rangeButtons.forEach(button => {

            button.setAttribute(
                "aria-pressed",
                String(button.dataset.range === "day")
            );
        });

        // Mark initial navigation state
        navLinks.forEach(link => {

            if (link.classList.contains("active")) {
                link.setAttribute("aria-current", "page");
            }
        });

        console.log("TERRA Energy Intelligence initialized.");
        console.log("Demo dataset loaded successfully.");
    }


    initializeDashboard();

});
