using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Core.Models.Membership;
using Umbraco.Web;
using Umbraco.Web.Composing;

namespace Bergmania.Collab.Collab
{
	[UmbracoHubAuthorize]
	public class CollabHub : Hub<ICollabHubClient>
	{
		private readonly IUmbracoContextAccessor _umbracoContextAccessor;

		private static readonly ConcurrentDictionary<string, UserRouteInfo> _userRouteInfoDictionary = new ConcurrentDictionary<string, UserRouteInfo>();
		private static readonly ConcurrentDictionary<string, ContentEditorInfo> _contentEditorInfoDictionary = new ConcurrentDictionary<string, ContentEditorInfo>();
		public CollabHub()
		{
			_umbracoContextAccessor = Current.UmbracoContextAccessor;
		}
		public void Heartbeat(RouteInfo routeInfo)
		{
			var user = _umbracoContextAccessor.UmbracoContext.Security.CurrentUser;


			var now = DateTimeOffset.Now;

			_userRouteInfoDictionary[Context.ConnectionId] = new UserRouteInfo()
			{
				Name = user.Name,
				UpdateTime = now,
				UserKey = user.Key,
				UserId = user.Id,
				Id = routeInfo.Id,
				Method = routeInfo.Method,
				Section = routeInfo.Section,
				Tree = routeInfo.Tree,
				Url = routeInfo.Url
			};

			_contentEditorInfoDictionary[Context.ConnectionId] = new ContentEditorInfo() { ContentId = routeInfo.Id, UserId = user.Id };

			Clients.All.UpdateOnlineUsers(_userRouteInfoDictionary.Values.DistinctBy(x => x.UserId).OrderBy(x => x.UpdateTime).ThenBy(x => x.Name), _contentEditorInfoDictionary.Values);
		}

		public override async Task OnDisconnected(bool stopCalled)
		{
			_userRouteInfoDictionary.TryRemove(Context.ConnectionId, out _);
			await base.OnDisconnected(stopCalled);
		}


	}
}