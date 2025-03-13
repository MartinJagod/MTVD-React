import React from 'react';

const MobileLayout = ({ branding1, logoVertical, starImage, interiorismo1, arquitectura1, groupImage, teamImage, projectCount, yearsCount, countriesCount, citiesCount, goToProject, goToProjects, goToAwardsAndPress, goToStudio }) => {
    return (
        <div className="mobile-layout">
            <div className="full-square desktop-hide">
                <div className="parallax-wrapper">
                    <img
                        src={branding1}
                        alt="Branding 1"
                        className="parallax-image"
                        onClick={() => goToProject(1)}
                    />
                </div>
                <div className="image-label-home">{branding1}</div>
                <div className="image-label-star">
                    <img src={starImage} alt="Star" className="star-image-foto" onClick={goToAwardsAndPress} />
                </div>
            </div>

            <section className="image-and-quadrants desktop-hide">
                <div className="quadrant-container">
                    <div className="quadrant white-box">
                        <span className="project-box">Inspiring</span>
                        <span className="project-box">people</span>
                    </div>
                    <div className="quadrant yellow-box" onClick={goToProjects}>
                        <div className="flip-container">
                            <div className="front">
                                <img src={logoVertical} alt="Logo Vertical" className="logo-image" />
                            </div>
                            <div className="back">
                                <span className='back-item'>Design</span>
                                <span className='back-item'>Architecture</span>
                                <span className='back-item'>Branding</span>
                            </div>
                        </div>
                    </div>
                    <div className="quadrant blue-box" onClick={goToProjects}>
                        <span className="project-count">+{projectCount}</span>
                        <span className="project-label">projects</span>
                    </div>
                    <div className="quadrant white-box" onClick={goToProjects}>
                        <span className="project-box">To create</span>
                        <span className="project-box">exciting</span>
                        <span className="project-box">places</span>
                    </div>
                </div>

                <div className="horizontal-counter-section-new">
                    <div className="horizontal-counter-item-new">
                        <span className="horizontal-project-count-new">+{yearsCount}</span>
                        <br />
                        <span className="horizontal-project-label-new">years</span>
                    </div>
                    <div className="horizontal-counter-item-new">
                        <span className="horizontal-project-count-new">+{countriesCount}</span>
                        <br />
                        <span className="horizontal-project-label-new">countries</span>
                    </div>
                    <div className="horizontal-counter-item-new">
                        <span className="horizontal-project-count-new">+{citiesCount}</span>
                        <br />
                        <span className="horizontal-project-label-new">cities</span>
                    </div>
                </div>

                <div className="full-square">
                    <div className="parallax-wrapper">
                        <img
                            src={interiorismo1}
                            alt="Interiorismo 1"
                            className="parallax-image"
                            onClick={() => goToProject(2)}
                        />
                    </div>
                    <div className="image-label-home">{interiorismo1}</div>
                    <div className="image-label-star">
                        <img src={starImage} alt="Star" className="star-image-foto" onClick={goToAwardsAndPress} />
                    </div>
                </div>

                <div className="full-square">
                    <div className="parallax-wrapper">
                        <img
                            src={arquitectura1}
                            alt="Architecture 1"
                            className="parallax-image"
                            onClick={() => goToProject(3)}
                        />
                    </div>
                    <div className="image-label-home">{arquitectura1}</div>
                    <div className="image-label-star">
                        <img src={starImage} alt="Star" className="star-image-foto" />
                    </div>
                </div>

                <div className="custom-quadrant-container">
                    <div className="custom-orange-box" onClick={goToStudio}>
                        <img src={groupImage} alt="Group Icon" className="icon-image" />
                    </div>
                    <div className="quadrant custom-white-box" onClick={goToStudio}>
                        <span className="text-Awards">Our Studioo</span>
                    </div>
                </div>

                <div className="horizontal-double-team">
                    <img src={teamImage} alt="Team" className="horizontal-image-team" onClick={goToStudio} />
                </div>
            </section>
        </div>
    );
};

export default MobileLayout;
