using System.Net;

namespace PaddleThroughLychnidos.API
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
