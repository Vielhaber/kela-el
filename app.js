document.addEventListener('DOMContentLoaded', () => {
    // 1. Interactive Hero Split Overlay Interaction
    const heroSection = document.querySelector('.hero-section');
    const splits = document.querySelectorAll('.hero-split');

    splits.forEach(split => {
        split.addEventListener('mouseenter', () => {
            const product = split.getAttribute('data-product');
            heroSection.classList.add(`${product}-hovered`);
        });

        split.addEventListener('mouseleave', () => {
            const product = split.getAttribute('data-product');
            heroSection.classList.remove(`${product}-hovered`);
        });
    });

    // 2. Navigation Scroll Helper for Product Action Buttons
    const selectProductBtns = document.querySelectorAll('[data-select-product]');
    selectProductBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productType = btn.getAttribute('data-select-product');
            
            // Highlight the product in the configurator
            selectConfiguratorProduct(productType);
            
            // Smooth scroll to the checkout configurator
            document.querySelector('#checkout').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 3. Interactive Battery Widget Logic (Product 1)
    const freqButtons = document.querySelectorAll('.freq-btn');
    const batteryLevelEl = document.getElementById('batteryLevel');
    const batteryDaysEl = document.getElementById('batteryDays');

    const batteryProfiles = {
        weekly: { level: '100%', text: 'ca. 365 Tage' },
        multi: { level: '50%', text: 'ca. 180 Tage' },
        daily: { level: '22%', text: 'ca. 75 Tage' }
    };

    if (freqButtons.length > 0) {
        freqButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                freqButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const freq = btn.getAttribute('data-freq');
                const profile = batteryProfiles[freq];
                
                if (batteryLevelEl) batteryLevelEl.style.width = profile.level;
                if (batteryDaysEl) batteryDaysEl.textContent = profile.text;

                if (batteryLevelEl) {
                    if (freq === 'daily') {
                        batteryLevelEl.style.backgroundColor = '#ff453a'; // red
                    } else if (freq === 'multi') {
                        batteryLevelEl.style.backgroundColor = '#ff9f0a'; // orange
                    } else {
                        batteryLevelEl.style.backgroundColor = '#c5a880'; // gold
                    }
                }
            });
        });
    }

    if (batteryLevelEl) {
        batteryLevelEl.style.width = '100%';
    }

    // 4. Color Swatches Interaction (Image & Calculator Sync)
    const swatches = document.querySelectorAll('.swatch');
    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const container = swatch.closest('.swatches');
            const targetProduct = container.getAttribute('data-target');
            
            // Toggle active swatch in this group
            container.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            
            // Get data
            const color = swatch.getAttribute('data-color');
            const artText = swatch.getAttribute('data-art');
            const lifestylePath = swatch.getAttribute('data-lifestyle');
            const cutoutPath = swatch.getAttribute('data-cutout');
            
            // Update product images
            if (targetProduct === 'chopper') {
                document.getElementById('chopperImgLifestyle').src = lifestylePath;
                document.getElementById('chopperImgCutout').src = cutoutPath;
                document.getElementById('chopperMeta').textContent = artText;
                
                // Sync with calculator label
                const nameMap = { creme: 'Creme, Art. 10131', grau: 'Dunkelgrau, Art. 10130' };
                document.getElementById('calcChopperLabel').textContent = `Zerkleinerer Split (${nameMap[color]})`;
            } else if (targetProduct === 'kettle') {
                document.getElementById('kettleImgLifestyle').src = lifestylePath;
                document.getElementById('kettleImgCutout').src = cutoutPath;
                document.getElementById('kettleMeta').textContent = artText;
                
                // Sync with calculator label
                const nameMap = { 
                    creme: 'Creme, Art. 10137', 
                    grau: 'Dunkelgrau, Art. 10135',
                    matcha: 'Matchagrün, Art. 10136',
                    schwarz: 'Schwarz, Art. 10138'
                };
                document.getElementById('calcKettleLabel').textContent = `Wasserkocher Santos (${nameMap[color]})`;
            }
            
            updateB2BCalculator();
        });
    });

    // 5. Dynamic B2B Bulk Calculator Logic
    const configItems = document.querySelectorAll('.config-item');
    const bulkQtyInput = document.getElementById('bulkQty');
    const qtyDecBtn = document.getElementById('qtyDec');
    const qtyIncBtn = document.getElementById('qtyInc');

    // Summary Elements
    const summaryItemsEl = document.getElementById('summaryItems');
    const summaryQtyEl = document.getElementById('summaryQty');
    const summaryNetPriceEl = document.getElementById('summaryNetPrice');
    const summaryMarginEl = document.getElementById('summaryMargin');
    const totalPriceEl = document.getElementById('totalPrice');
    const discountRow = document.getElementById('discountRow');
    const bundlePromoEl = document.getElementById('bundlePromo');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // B2B Pricing Constants
    const baseUnitPrice = 30.95; // net price for Qty < 100
    const retailPriceBrutto = 59.95; // consumer UVP

    if (qtyDecBtn) {
        qtyDecBtn.addEventListener('click', () => {
            let val = parseInt(bulkQtyInput.value) || 0;
            if (val > 10) {
                bulkQtyInput.value = val - 10;
                updateB2BCalculator();
            }
        });
    }

    if (qtyIncBtn) {
        qtyIncBtn.addEventListener('click', () => {
            let val = parseInt(bulkQtyInput.value) || 0;
            bulkQtyInput.value = val + 10;
            updateB2BCalculator();
        });
    }

    if (bulkQtyInput) {
        bulkQtyInput.addEventListener('input', () => {
            let val = parseInt(bulkQtyInput.value) || 0;
            if (val < 1) {
                bulkQtyInput.value = 10;
            }
            updateB2BCalculator();
        });
    }

    configItems.forEach(item => {
        item.addEventListener('click', () => {
            const checkbox = item.querySelector('.checkbox-indicator');
            item.classList.toggle('checked');
            
            updateB2BCalculator();
        });
    });

    function selectConfiguratorProduct(productType) {
        configItems.forEach(item => {
            const itemType = item.getAttribute('data-item');
            
            if (itemType === productType) {
                item.classList.add('checked');
            }
        });
        updateB2BCalculator();
    }

    function calculateUnitPrice(qty) {
        if (qty >= 100) return 29.50;
        return baseUnitPrice;
    }

    function updateB2BCalculator() {
        if (!bulkQtyInput) return;
        const qty = parseInt(bulkQtyInput.value) || 10;
        let selectedCount = 0;
        const activeItems = [];

        configItems.forEach(item => {
            if (item.classList.contains('checked')) {
                const itemType = item.getAttribute('data-item');
                activeItems.push(itemType);
                selectedCount++;
            }
        });

        // Calculations
        const currentUnitPrice = calculateUnitPrice(qty);
        const totalUnits = qty * selectedCount;
        const totalNetPrice = totalUnits * currentUnitPrice;
        
        // Dealer Margin calculation relative to Brutto UVP (59.95 €)
        const totalGrossRevenue = totalUnits * retailPriceBrutto;
        const totalMarginEUR = totalGrossRevenue - totalNetPrice;
        const marginPercent = totalGrossRevenue > 0 ? (totalMarginEUR / totalGrossRevenue) * 100 : 0;

        // UI Updates
        if (selectedCount === 2) {
            summaryItemsEl.textContent = 'Zerkleinerer, Wasserkocher';
            if (bundlePromoEl) bundlePromoEl.classList.add('active');
            if (discountRow) discountRow.style.display = 'flex';
            checkoutBtn.textContent = 'Großmenge anfragen';
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
        } else if (selectedCount === 1) {
            const name = activeItems[0] === 'chopper' ? 'Zerkleinerer' : 'Wasserkocher';
            summaryItemsEl.textContent = name;
            if (bundlePromoEl) bundlePromoEl.classList.remove('active');
            if (discountRow) discountRow.style.display = 'none';
            checkoutBtn.textContent = `${name} anfragen`;
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
        } else {
            summaryItemsEl.textContent = 'Keine Auswahl';
            if (bundlePromoEl) bundlePromoEl.classList.remove('active');
            if (discountRow) discountRow.style.display = 'none';
            checkoutBtn.textContent = 'Bitte Artikel wählen';
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.5';
        }

        summaryQtyEl.textContent = `${totalUnits} Einheiten (${qty} je Typ)`;
        summaryNetPriceEl.textContent = formatPrice(currentUnitPrice);
        summaryMarginEl.textContent = `${formatPrice(totalMarginEUR)} (${marginPercent.toFixed(1)}%)`;
        totalPriceEl.textContent = formatPrice(totalNetPrice);
    }

    function formatPrice(amount) {
        return amount.toLocaleString('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).replace('EUR', '€');
    }

    // Initialize Calculator values
    updateB2BCalculator();

    // 6. B2B Request Action (Micro-interaction)
    checkoutBtn.addEventListener('click', () => {
        if (checkoutBtn.disabled) return;

        checkoutBtn.textContent = 'B2B-Anfrage wird übermittelt...';
        checkoutBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            checkoutBtn.innerHTML = '<span style="color:#ffffff;">✓ Anfrage erfolgreich übermittelt</span>';
            
            // Premium B2B success notification
            showSuccessNotification();
            
            setTimeout(() => {
                checkoutBtn.style.pointerEvents = 'auto';
                updateB2BCalculator();
            }, 3000);
        }, 1500);
    });

    function showSuccessNotification() {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '2rem';
        notification.style.right = '2rem';
        notification.style.backgroundColor = '#161617';
        notification.style.border = '1px solid #333336';
        notification.style.color = '#f5f5f7';
        notification.style.padding = '1.5rem 2.5rem';
        notification.style.borderRadius = '12px';
        notification.style.boxShadow = '0 20px 50px rgba(0,0,0,0.6)';
        notification.style.zIndex = '1000';
        notification.style.fontFamily = 'Inter, sans-serif';
        notification.style.fontSize = '0.85rem';
        notification.style.animation = 'fadeIn 0.5s ease';
        notification.innerHTML = `
            <div style="display:flex; align-items:center; gap:1.2rem;">
                <span style="color:#0071e3; font-size:1.1rem;">✓</span>
                <div>
                    <strong style="display:block; margin-bottom:0.2rem; color:#fff; font-size:0.75rem;">B2B-Anfrage registriert</strong>
                    <span>Ein Großkundenberater wird sich innerhalb von 2 Stunden melden.</span>
                </div>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transition = 'opacity 0.5s ease';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    // 7. B2B POS Revenue & Margin Simulator Logic
    const simTraffic = document.getElementById('simTraffic');
    const simMonths = document.getElementById('simMonths');
    const valTraffic = document.getElementById('valTraffic');
    const valMonths = document.getElementById('valMonths');
    
    const simTotalRevenue = document.getElementById('simTotalRevenue');
    const simDealerProfit = document.getElementById('simDealerProfit');
    const barStandard = document.getElementById('barStandard');
    const barKela = document.getElementById('barKela');
    const lblStandardRevenue = document.getElementById('lblStandardRevenue');
    const lblKelaRevenue = document.getElementById('lblKelaRevenue');
    
    const simConceptBtns = document.querySelectorAll('.concept-btn');
    
    let activeConcept = 'premium'; // default active concept
    const conversionRates = {
        standard: 0.005,  // 0.5%
        themen: 0.012,    // 1.2%
        premium: 0.025    // 2.5%
    };
    
    const itemUvpBrutto = 59.95;
    const itemB2BNetto = 30.95;
    const dealerMarginPerItem = itemUvpBrutto - itemB2BNetto; // 29.00 € margin
    
    function updateSimulator() {
        if (!simTraffic || !simMonths) return;
        
        const traffic = parseInt(simTraffic.value) || 300;
        const months = parseInt(simMonths.value) || 6;
        const days = months * 30;
        const totalTraffic = traffic * days;
        
        // Update labels
        valTraffic.textContent = `${traffic} Besucher / Tag`;
        valMonths.textContent = `${months} ${months === 1 ? 'Monat' : 'Monate'}`;
        
        // Standard Concept calculations (0.5% conversion constant)
        const stdConversionRate = conversionRates.standard;
        const stdUnits = Math.round(totalTraffic * stdConversionRate);
        const stdRevenue = stdUnits * itemUvpBrutto;
        
        // Active chosen concept calculations
        const chosenRate = conversionRates[activeConcept];
        const kelaUnits = Math.round(totalTraffic * chosenRate);
        const kelaRevenue = kelaUnits * itemUvpBrutto;
        const dealerProfit = kelaUnits * dealerMarginPerItem;
        
        // Update metric values in HTML
        simTotalRevenue.textContent = formatPrice(kelaRevenue);
        simDealerProfit.textContent = formatPrice(dealerProfit);
        
        lblStandardRevenue.textContent = formatPrice(stdRevenue);
        lblKelaRevenue.textContent = formatPrice(kelaRevenue);
        
        // Update chart bars width
        if (kelaRevenue > 0) {
            barKela.style.width = '100%';
            const stdPercent = (stdRevenue / kelaRevenue) * 100;
            barStandard.style.width = `${Math.max(5, stdPercent)}%`;
        } else {
            barKela.style.width = '0%';
            barStandard.style.width = '0%';
        }
    }
    
    if (simConceptBtns.length > 0) {
        simConceptBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                simConceptBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeConcept = btn.getAttribute('data-concept');
                updateSimulator();
            });
        });
    }
    
    if (simTraffic) simTraffic.addEventListener('input', updateSimulator);
    if (simMonths) simMonths.addEventListener('input', updateSimulator);
    
    // Initialize Simulator values
    updateSimulator();
});
