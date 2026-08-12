using System.Net;

namespace PaddleThroughLychnidos.Domain.Shared
{
    public class PaddleThroughLychnidosException : Exception
    {
        public HttpStatusCode StatusCode { get; }

        public PaddleThroughLychnidosException(string message, HttpStatusCode statusCode = HttpStatusCode.BadRequest)
            : base(message)
        {
            StatusCode = statusCode;
        }
    }
}
