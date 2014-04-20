define (['views/index', 'views/admin'], function (viewIndex, viewAdmin){
	var appRouter = Backbone.Router.extend ({
		
		currentView: null,
		
		routes: {
			'index': 'index',
			'admin': 'admin'
		},
		
		changeView: function (view) {
			if ( null != this.currentView ) {
				this.currentView.undelegateEvents();
			}
			this.currentView = view;
			this.currentView.render();
		},
		
		index: function() {
			this.changeView( new viewIndex() );
		},
		
		admin: function() {
			this.changeView( new viewAdmin() );
		}
		
	});
	
	return new appRouter();
	
});