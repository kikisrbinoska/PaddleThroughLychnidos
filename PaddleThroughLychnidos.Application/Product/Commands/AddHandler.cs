using MediatR;
using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Product.Commands
{
    public class AddHandler : IRequestHandler<AddRequest, AddResponse>
    {
        // Simulated membership perk (see Shop.Commands.SelectMembershipCommand) -
        // Free-tier shops are capped at this many products; Premium is unlimited.
        private const int FreeTierProductLimit = 5;

        private readonly IProductRepository _productRepository;
        private readonly IShopRepository _shopRepository;

        public AddHandler(IProductRepository productRepository, IShopRepository shopRepository)
        {
            _productRepository = productRepository;
            _shopRepository = shopRepository;
        }

        public async Task<AddResponse> Handle(AddRequest request, CancellationToken cancellationToken)
        {
            var shop = await _shopRepository.GetByIdAsync(request.ShopId)
                ?? throw new PaddleThroughLychnidosException("Shop not found", HttpStatusCode.NotFound);

            if (shop.OwnerId != request.RequestingUserId)
            {
                throw new PaddleThroughLychnidosException("You do not have permission to add products to this shop", HttpStatusCode.Forbidden);
            }

            if (shop.MembershipTier == MembershipTier.Free)
            {
                var existingCount = await _productRepository.GetCountByShopAsync(request.ShopId);
                if (existingCount >= FreeTierProductLimit)
                {
                    throw new PaddleThroughLychnidosException(
                        $"Free plan shops are limited to {FreeTierProductLimit} products - upgrade to Premium for unlimited products",
                        HttpStatusCode.Forbidden);
                }
            }

            var product = new Domain.Entities.Product
            {
                ShopId = request.ShopId,
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                ImageUrl = request.ImageUrl,
            };

            await _productRepository.AddAsync(product);

            return new AddResponse
            {
                Id = product.Id,
                ShopId = product.ShopId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                Message = "Product created successfully",
            };
        }
    }
}
