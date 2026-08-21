using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.DayPlan.Commands
{
    public class CreateHandler : IRequestHandler<CreateRequest, CreateResponse>
    {
        private readonly IDayPlanRepository _dayPlanRepository;
        private readonly ITravelPlanItemRepository _travelPlanItemRepository;
        private readonly IShopRepository _shopRepository;

        public CreateHandler(
            IDayPlanRepository dayPlanRepository,
            ITravelPlanItemRepository travelPlanItemRepository,
            IShopRepository shopRepository)
        {
            _dayPlanRepository = dayPlanRepository;
            _travelPlanItemRepository = travelPlanItemRepository;
            _shopRepository = shopRepository;
        }

        public async Task<CreateResponse> Handle(CreateRequest request, CancellationToken cancellationToken)
        {
            var savedItems = await _travelPlanItemRepository.GetByUserIdAsync(request.UserId);
            var savedShopIds = savedItems
                .Where(item => item.ShopId.HasValue)
                .Select(item => item.ShopId!.Value)
                .ToHashSet();

            var notSaved = request.ShopIds.Where(id => !savedShopIds.Contains(id)).ToList();
            if (notSaved.Count > 0)
            {
                throw new PaddleThroughLychnidosException(
                    $"Shop(s) {string.Join(", ", notSaved)} must be saved to your travel plan before adding them to a day plan.",
                    HttpStatusCode.BadRequest);
            }

            var shops = await _shopRepository.GetByIdsAsync(request.ShopIds);
            var shopsById = shops.ToDictionary(s => s.Id, s => s);

            var dayPlan = new Domain.Entities.DayPlan
            {
                UserId = request.UserId,
                Title = request.Title,
                Date = request.Date,
                CreatedAt = DateTime.UtcNow,
                Stops = request.ShopIds
                    .Select((shopId, index) => new Domain.Entities.DayPlanStop
                    {
                        ShopId = shopId,
                        Order = index + 1,
                    })
                    .ToList(),
            };

            await _dayPlanRepository.AddAsync(dayPlan);

            return new CreateResponse
            {
                Id = dayPlan.Id,
                Title = dayPlan.Title,
                Date = dayPlan.Date,
                Stops = dayPlan.Stops
                    .OrderBy(s => s.Order)
                    .Select(s => new CreateStopResponse
                    {
                        ShopId = s.ShopId,
                        ShopName = shopsById.GetValueOrDefault(s.ShopId)?.Name ?? "Unknown",
                        Order = s.Order,
                    })
                    .ToList(),
                Message = "Day plan created successfully",
            };
        }
    }
}
