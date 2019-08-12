using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Core.Models;
using Umbraco.Core.Models.Membership;

namespace Bergmania.Collab.Collab
{
	public class ContentEditorInfo
	{
		public int UserId { get; set; }
		public string ContentId { get; set; }
	}
}
