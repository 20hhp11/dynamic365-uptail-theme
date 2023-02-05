/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { IProductsDimensionsAvailabilities } from '@msdyn365-commerce/commerce-entities';
import { IPriceComponentResources, ProductComponent } from '@msdyn365-commerce/components';
import { ICoreContext, IImageSettings } from '@msdyn365-commerce/core';
import { ProductSearchResult } from '@msdyn365-commerce/retail-proxy';
import { ArrayExtensions } from '@msdyn365-commerce-modules/retail-actions';
import { ITelemetryContent } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { ISearchResultContainerResources } from '../search-result-container.props.autogenerated';

interface IProductSearchResultItems {
    products: ProductSearchResult[];
    context: ICoreContext;
    resources: ISearchResultContainerResources;
    imageSettings?: IImageSettings;
    moduleType: string;
    moduleId: string;
    allowBackNavigation?: boolean;
    telemetryContent: ITelemetryContent;
    quickviewSlot?: {} | null | undefined;
    productComparisonButton?: {} | null | undefined;
    channelInventoryConfigurationId?: number;
    isPriceMinMaxEnabled?: boolean;
    productsDimensionAvailabilities?: IProductsDimensionsAvailabilities[][];
}

/**
 * Returns the product inventory label.
 * @param  channelInventoryConfigurationId - The channel configuration Id.
 * @param  product - The product.
 * @returns The inventory label.
 */
export function getInventoryLabel(channelInventoryConfigurationId: number | undefined, product: ProductSearchResult): string | undefined {
    if (!channelInventoryConfigurationId || !ArrayExtensions.hasElements(product.AttributeValues)) {
        return undefined;
    }
    const inventoryAttribute = product.AttributeValues.find((attribute) => attribute.RecordId === channelInventoryConfigurationId);
    if (inventoryAttribute) {
        return inventoryAttribute.TextValue;
    }
    return undefined;
}

export const ProductSearchResultItems: React.FC<IProductSearchResultItems> = ({
    products,
    context,
    imageSettings,
    resources,
    moduleType,
    moduleId,
    allowBackNavigation,
    telemetryContent,
    quickviewSlot,
    productComparisonButton,
    channelInventoryConfigurationId,
    isPriceMinMaxEnabled,
    productsDimensionAvailabilities
}) => {
    const priceResources: IPriceComponentResources = {
        priceRangeSeparator: resources.priceRangeSeparator
    };
    return (
        <ul className='list-unstyled'>
            {products.map((product: ProductSearchResult, index: number) => (
                <li className='ms-product-search-result__item' key={index}>
                    <ProductComponent
                        context={context}
                        telemetryContent={telemetryContent}
                        imageSettings={imageSettings}
                        freePriceText={resources.priceFree}
                        originalPriceText={resources.originalPriceText}
                        currentPriceText={resources.currentPriceText}
                        ratingAriaLabel={resources.ratingAriaLabel}
                        allowBack={allowBackNavigation}
                        id={moduleId}
                        key={product.RecordId}
                        typeName={moduleType}
                        data={{ product }}
                        quickViewButton={quickviewSlot}
                        productComparisonButton={productComparisonButton}
                        inventoryLabel={getInventoryLabel(channelInventoryConfigurationId, product)}
                        isPriceMinMaxEnabled={isPriceMinMaxEnabled}
                        priceResources={priceResources}
                        swatchItemAriaLabel={resources.swatchItemAriaLabel}
                        dimensionAvailabilities={productsDimensionAvailabilities?.find(
                            (dimensionAvailability) =>
                                ArrayExtensions.hasElements(dimensionAvailability) &&
                                dimensionAvailability[0].masterProductId === product.MasterProductId
                        )}
                    />
                </li>
            ))}
        </ul>
    );
};
