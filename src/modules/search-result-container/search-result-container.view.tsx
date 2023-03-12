/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { ISearchResultModalViewProps } from './components';
import {
    ICategoryHierarchyViewProps,
    IRefineMenuViewProps,
    ISearchResultContainerViewProps,
    ISortByViewProps,
    ITitleViewProps
} from './search-result-container';

const SearchResultContainerView: React.FC<ISearchResultContainerViewProps> = (props) => {
    const {
        SearchResultContainer,
        products,
        pagination,
        ProductsContainer,
        ProductSectionContainer,
        ProductCategorySectionContainer,
        choiceSummary,
        isMobile,
        modalToggle,
        searchResultModal,
        TitleViewProps,
        menuBar,
        refineMenu,
        categoryHierarchy,
        sortByOptions,
        CategoryNavContainer,
        RefineAndProductSectionContainer,
        errorMessage,
        FeatureSearchContainer,
        similarLookProduct
    } = props;
    const isRecoSearchPage = props.context.actionContext.requestContext.query?.recommendation;
    if (isMobile) {
        return (
            <Module {...SearchResultContainer}>
                {renderCategoryHierarchy(categoryHierarchy)}
                {renderTitleWithCount(TitleViewProps)}
                {choiceSummary}
                {modalToggle}
                {createSearchResultModal(searchResultModal, refineMenu, sortByOptions, isRecoSearchPage)}
                <Node {...FeatureSearchContainer}>{similarLookProduct}</Node>
                <Node {...ProductsContainer}>
                    {errorMessage}
                    {products}
                </Node>
                {pagination}
            </Module>
        );
    }
    return (
        <Module {...SearchResultContainer}>
            <Node {...RefineAndProductSectionContainer}>
                <Node {...ProductCategorySectionContainer}>
                    <Node className='ms-header__desktop-view'>{_renderReactFragment(menuBar)}</Node>
                </Node>
                <Node {...ProductSectionContainer}>
                    {TitleViewProps && renderTitleWithCount(TitleViewProps)}
                    <Node {...CategoryNavContainer}>{categoryHierarchy && renderCategoryHierarchy(categoryHierarchy)}</Node>
                    {choiceSummary}
                    {refineMenu && renderRefiner(refineMenu)}
                    {sortByOptions && !isRecoSearchPage && renderSort(sortByOptions)}
                    <Node {...FeatureSearchContainer}>{similarLookProduct}</Node>
                    <Node {...ProductsContainer}>
                        {errorMessage}
                        {products}
                    </Node>
                    {pagination}
                </Node>
            </Node>
        </Module>
    );
};

function _renderReactFragment(items: React.ReactNode[]): JSX.Element | null {
    return (
        <>
            {items && items.length > 0
                ? items.map((slot: React.ReactNode, index: number) => {
                      return <React.Fragment key={index}>{slot}</React.Fragment>;
                  })
                : null}
        </>
    );
}

const createSearchResultModal = (
    modalProps: ISearchResultModalViewProps,
    refineMenu: IRefineMenuViewProps,
    sortByDropDown: ISortByViewProps,
    isRecoSearchPage?: string
): JSX.Element => {
    return React.cloneElement(
        modalProps.modal,
        {},
        modalProps.modalHeader,
        createModalBody(modalProps, refineMenu, sortByDropDown, isRecoSearchPage),
        modalProps.modalFooter
    );
};

const createModalBody = (
    props: ISearchResultModalViewProps,
    refineMenu: IRefineMenuViewProps,
    sortByDropDown: ISortByViewProps,
    isRecoSearchPage?: string
): JSX.Element | null => {
    if (sortByDropDown) {
        return React.cloneElement(props.modalBody, {}, renderSort(sortByDropDown, isRecoSearchPage), renderRefiner(refineMenu));
    }
    return null;
};

const renderRefiner = (props: IRefineMenuViewProps): JSX.Element | null => {
    const { refiners, RefineMenuContainer, RefinerSectionContainer } = props;
    if (refiners) {
        return (
            <Node {...RefinerSectionContainer}>
                <Node {...RefineMenuContainer}>
                    {refiners.map((submenu, index) => (
                        <React.Fragment key={index}>{submenu}</React.Fragment>
                    ))}
                </Node>
            </Node>
        );
    }
    return null;
};

const renderSort = (props: ISortByViewProps, isRecoSearchPage?: string): JSX.Element | null => {
    const { SortingContainer, sortByDropDown } = props;
    if (sortByDropDown && !isRecoSearchPage) {
        return <Node {...SortingContainer}>{sortByDropDown}</Node>;
    }
    return null;
};

const renderCategoryHierarchy = (props: ICategoryHierarchyViewProps): JSX.Element | null => {
    const { CategoryHierarchyContainer, categoryHierarchyList, categoryHierarchySeparator } = props;
    if (categoryHierarchyList) {
        return (
            <Node {...CategoryHierarchyContainer}>
                {categoryHierarchyList.map((category, index) => (
                    <React.Fragment key={index}>
                        {category}
                        {categoryHierarchyList && categoryHierarchyList[index + 1] && categoryHierarchySeparator}
                    </React.Fragment>
                ))}
            </Node>
        );
    }

    return null;
};

const renderTitleWithCount = (props: ITitleViewProps): JSX.Element | null => {
    const { title, TitleContainer } = props;
    if (title) {
        return (
            <Node {...TitleContainer}>
                <h2>
                    {title.titlePrefix}
                    {title.titleText}
                    {title.titleCount}
                </h2>
            </Node>
        );
    }
    return null;
};

export default SearchResultContainerView;
