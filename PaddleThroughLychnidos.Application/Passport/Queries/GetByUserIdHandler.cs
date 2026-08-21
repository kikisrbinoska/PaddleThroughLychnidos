using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.Passport.Queries
{
    public class GetByUserIdHandler : IRequestHandler<GetByUserIdRequest, GetByUserIdResponse>
    {
        private readonly IPassportStampRepository _passportStampRepository;

        public GetByUserIdHandler(IPassportStampRepository passportStampRepository)
        {
            _passportStampRepository = passportStampRepository;
        }

        public async Task<GetByUserIdResponse> Handle(GetByUserIdRequest request, CancellationToken cancellationToken)
        {
            var stamps = await _passportStampRepository.GetByUserIdAsync(request.UserId);

            var dtos = stamps
                .Select(stamp => new PassportStampDto
                {
                    Id = stamp.Id,
                    ShopId = stamp.ShopId,
                    ShopName = stamp.Shop.Name,
                    CategoryName = stamp.Shop.Category?.Name ?? string.Empty,
                    RegionName = stamp.Shop.Region?.Name ?? string.Empty,
                    ThumbnailUrl = stamp.Shop.Images.FirstOrDefault()?.Url ?? string.Empty,
                    VisitedAt = stamp.VisitedAt,
                })
                .ToList();

            return new GetByUserIdResponse
            {
                Stamps = dtos,
                TotalCount = dtos.Count,
            };
        }
    }
}
