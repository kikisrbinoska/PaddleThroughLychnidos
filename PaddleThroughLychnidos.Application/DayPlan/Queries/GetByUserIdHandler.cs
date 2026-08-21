using MediatR;
using PaddleThroughLychnidos.Application.Shared;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.DayPlan.Queries
{
    public class GetByUserIdHandler : IRequestHandler<GetByUserIdRequest, GetByUserIdResponse>
    {
        private readonly IDayPlanRepository _dayPlanRepository;

        public GetByUserIdHandler(IDayPlanRepository dayPlanRepository)
        {
            _dayPlanRepository = dayPlanRepository;
        }

        public async Task<GetByUserIdResponse> Handle(GetByUserIdRequest request, CancellationToken cancellationToken)
        {
            var plans = await _dayPlanRepository.GetByUserIdAsync(request.UserId);

            var dtos = plans
                .Select(plan => new DayPlanDto
                {
                    Id = plan.Id,
                    Title = plan.Title,
                    Date = plan.Date,
                    Stops = plan.Stops
                        .OrderBy(s => s.Order)
                        .Select(s => new DayPlanStopDto
                        {
                            Order = s.Order,
                            Shop = new ShopSummaryDto
                            {
                                Id = s.Shop.Id,
                                Name = s.Shop.Name,
                                Latitude = s.Shop.Latitude,
                                Longitude = s.Shop.Longitude,
                                ImageUrl = s.Shop.Images.FirstOrDefault()?.Url ?? string.Empty,
                            },
                        })
                        .ToList(),
                })
                .ToList();

            return new GetByUserIdResponse { Plans = dtos };
        }
    }
}
