import React from "react";
import DashboardProject from "../admin-dashboard/DashboardProject";
import { connect } from "react-redux";
import AddProject from "../projects/AddProject";

const DashboardMetrics = props => {
  // console.log("Props from dashmetrics", props)
  return (
    <div className="admin-projects-container">
      <div className="admin-projects-head">
        <h1 className="admin-projects-title">Projects</h1>
        {props.activeProductStore.active && <AddProject currId={props.activeProductStore.active} />}
      </div>
      <div className="admin-projects-content-container">
        {props.activeProductStore.active &&
          props.products.map(product => {
            if(props.activeProductStore.active.id === product.id){
              return props.activeProductStore.active.projects.map((el, i) => (
                <DashboardProject product={product} key={i} el={el} />
              ))
            }
          })
}
        {props.activeProductStore.active &&
          props.activeProductStore.active.projects.length === 0 && (
            <p className="admin-projects-empty">No projects</p>
          )}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    activeProductStore: state.activeProductStore
  };
};

export default connect(mapStateToProps, null)(DashboardMetrics);
