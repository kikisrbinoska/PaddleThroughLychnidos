using MediatR;

namespace PaddleThroughLychnidos.Application.Region.Comands
{
    /// <summary>
    /// One-time fix-up for shops that have coordinates but no RegionId -
    /// mainly shops inserted by ShopImport.Commands.ImportOhridShopsCommand
    /// before it started matching against region polygons. Re-checks every
    /// shop with RegionId == null against each region's PolygonGeoJson and
    /// assigns the first match. Safe to run repeatedly - only touches shops
    /// currently unassigned.
    /// </summary>
    public class BackfillShopRegionsRequest : IRequest<BackfillShopRegionsResponse>
    {
    }
}
