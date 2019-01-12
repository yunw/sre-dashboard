import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Dashboard from "./Dashboard";
import Objectives from "./Objectives";
import RosterRelease from "./RosterRelease";
import axios from "axios";
import Help from "./Help";

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
  }
});

class FullWidthTabs extends React.Component {
  state = {
    value: 0,
    headerText: "Core Metrics",
    latencyData: "",
    trafficData: "",
    errorData: "",
    saturationData: ""
  };

  componentDidMount = () => {
    axios.get("http://localhost:4000/healthcheck").then(res => {
      this.setState({
        latencyData: res.data.latency,
        trafficData: res.data.traffic,
        errorData: res.data.errors,
        saturationData: res.data.saturation
      });
    });
  };

  handleRefresh = () => {
    axios.get("http://localhost:4000/healthcheck").then(res => {
      this.setState({
        latencyData: res.data.latency,
        trafficData: res.data.traffic,
        errorData: res.data.errors,
        saturationData: res.data.saturation
      });
    });
  };

  handleChange = (event, value) => {
    if (value === 1) {
      this.setState({
        value,
        headerText: "Objectives"
      });
    } else if (value === 2) {
      this.setState({
        value,
        headerText: "Roster & Releases"
      });
    } else if (value === 3) {
      this.setState({
        value,
        headerText: "Help"
      });
    } else {
      this.setState({
        value,
        headerText: "Core Metrics"
      });
    }
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <React.Fragment>
        <h3 className="title">Monitoring Service - {this.state.headerText}</h3>
        <div>
          <AppBar position="static" color="default">
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Dashboard" />
              <Tab label="Objectives" />
              <Tab label="Roster & Releases" />
              <Tab label="Help" />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
          >
            <TabContainer dir={theme.direction}>
              <Dashboard
                handleRefresh={this.handleRefresh}
                latencyData={this.state.latencyData}
                trafficData={this.state.trafficData}
                errorData={this.state.errorData}
                saturationData={this.state.saturationData}
              />
            </TabContainer>
            <TabContainer dir={theme.direction}>
              <Objectives />
            </TabContainer>
            <TabContainer dir={theme.direction}>
              <RosterRelease />
            </TabContainer>
            <TabContainer dir={theme.direction}>
              <Help />
            </TabContainer>
          </SwipeableViews>
        </div>
      </React.Fragment>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(FullWidthTabs);
