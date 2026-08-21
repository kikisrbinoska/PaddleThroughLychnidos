using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.DayPlan.Commands
{
    public class DeleteHandler : IRequestHandler<DeleteRequest, DeleteResponse>
    {
        private readonly IDayPlanRepository _dayPlanRepository;

        public DeleteHandler(IDayPlanRepository dayPlanRepository)
        {
            _dayPlanRepository = dayPlanRepository;
        }

        public async Task<DeleteResponse> Handle(DeleteRequest request, CancellationToken cancellationToken)
        {
            var dayPlan = await _dayPlanRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Day plan not found", HttpStatusCode.NotFound);

            if (dayPlan.UserId != request.UserId)
            {
                throw new PaddleThroughLychnidosException("You do not have permission to delete this day plan", HttpStatusCode.Forbidden);
            }

            await _dayPlanRepository.DeleteAsync(dayPlan);

            return new DeleteResponse
            {
                Id = request.Id,
                Message = "Day plan deleted successfully",
            };
        }
    }
}
