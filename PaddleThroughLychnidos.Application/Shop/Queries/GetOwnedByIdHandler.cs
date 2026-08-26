using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class GetOwnedByIdHandler : IRequestHandler<GetOwnedByIdRequest, OwnedShopDto>
    {
        private readonly IShopRepository _shopRepository;
        private readonly IReviewRepository _reviewRepository;
        private readonly IVerificationRequestRepository _verificationRequestRepository;

        public GetOwnedByIdHandler(
            IShopRepository shopRepository,
            IReviewRepository reviewRepository,
            IVerificationRequestRepository verificationRequestRepository)
        {
            _shopRepository = shopRepository;
            _reviewRepository = reviewRepository;
            _verificationRequestRepository = verificationRequestRepository;
        }

        public async Task<OwnedShopDto> Handle(GetOwnedByIdRequest request, CancellationToken cancellationToken)
        {
            var shop = await _shopRepository.GetByIdWithDetailsAsync(request.ShopId)
                ?? throw new PaddleThroughLychnidosException("Shop not found", HttpStatusCode.NotFound);

            if (shop.OwnerId != request.OwnerId)
            {
                throw new PaddleThroughLychnidosException("You do not have permission to view this shop", HttpStatusCode.Forbidden);
            }

            return await OwnedShopMapper.ToDto(shop, _shopRepository, _reviewRepository, _verificationRequestRepository);
        }
    }
}
