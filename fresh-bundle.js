var fresh = {
  mixins: {},
  widgets: {},
  getWidgetByName: function(widgetName) {
    return this.widgets[widgetName];
  },
  start: function(rootProps, container) {
    var widget = this.getWidgetByName(rootProps.widget),
        content;
    if (!widget) {
      return;
    }
    React.renderComponent(widget(rootProps), container);
  }
};

fresh.url = {
  getParams: function () {
    var str = window.location.search.substr(1),
        params = {};
    if (str) {
      var pairs = str.split('&'),
          parts;
      for (var i = 0; i < pairs.length; i++) {
        parts = pairs[i].split('=');
        params[parts[0]] = decodeURIComponent(parts[1]);
      }
    }
    return params;
  }
};

fresh.mixins.DataManagerMixin = {
  loadCommentsFromServer: function() {
    var url = this.props.data;
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  getDefaultProps: function() {
    return {
      // Set pollInterval to 0 to disable polling
      pollInterval: 2000
    };
  },
  getInitialState: function() {
    return {data: []};
  },
  componentWillMount: function() {
    this.loadCommentsFromServer();
    if (this.props.pollInterval) {
      this.setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    }
  }
};

fresh.mixins.SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.map(clearInterval);
  }
};

/** @jsx React.DOM */

fresh.widgets.Author = React.createClass({
  /**
   * Input: {
   *   widget: 'Author',
   *   name: 'Dan Ciotu'
   * }
   */
  render: function() {
    return (
      React.DOM.div(null, this.props.name)
    );
  }
});

/** @jsx React.DOM */

fresh.widgets.Timeline = React.createClass({
  /**
   * Input: {
   *   widget: 'Timeline',
   *   item: 'Author',
   *   data: 'http://localhost/static/users.json'
   * }
   */
  mixins: [fresh.mixins.SetIntervalMixin,
           fresh.mixins.DataManagerMixin],
  render: function() {
    var itemWidget = fresh.getWidgetByName(this.props.item);
    return (
      React.DOM.ul( {className:"Timeline"}, 
        this.state.data.map(function(item, index) {
          return React.DOM.li( {key:index}, itemWidget(item))
        })
      )
    );
  }
});
