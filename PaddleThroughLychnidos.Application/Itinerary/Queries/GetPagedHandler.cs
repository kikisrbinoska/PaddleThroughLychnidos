using MediatR;
using PaddleThroughLychnidos.Domain.DTOs;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.Itinerary.Queries
{
    public class GetPagedHandler : IRequestHandler<GetPagedRequest, GetPagedResponse>
    {
        private readonly IItineraryRepository _itineraryRepository;

        public GetPagedHandler(IItineraryRepository itineraryRepository)
        {
            _itineraryRepository = itineraryRepository;
        }

        public async Task<GetPagedResponse> Handle(GetPagedRequest request, CancellationToken cancellationToken)
        {
            var pageNumber = request.PageNumber.GetValueOrDefault(1) < 1 ? 1 : request.PageNumber.GetValueOrDefault(1);
            var pageSize = request.PageSize.GetValueOrDefault(20) < 1 ? 20 : request.PageSize.GetValueOrDefault(20);

            var (count, list) = await _itineraryRepository.GetPagedAsync(pageNumber, pageSize, request.RegionId);

            var items = list
                .Select(itinerary => new ItineraryListDto
                {
                    Id = itinerary.Id,
                    Title = itinerary.Title,
                    CoverImageUrl = itinerary.CoverImageUrl,
                    DurationHours = itinerary.DurationHours,
                    RegionName = itinerary.Region?.Name ?? "Unknown",
                    Difficulty = itinerary.Difficulty.ToString(),
                })
                .ToList();

            var totalPages = (int)Math.Ceiling(count / (double)pageSize);

            return new GetPagedResponse
            {
                Items = items,
                Metadata = new Metadata
                {
                    TotalCount = count,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = totalPages,
                },
            };
        }
    }
}
